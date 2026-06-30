#!/usr/bin/env node
/**
 * Autonomous developer script.
 *
 * Reads a requirement (GitHub issue or local markdown file), calls an
 * OpenAI-compatible LLM with the project context, applies the generated
 * file changes, runs quality gates (lint / type-check / build), and either
 * pushes a branch + opens a PR (in CI) or prints a local summary.
 *
 * Usage:
 *   node scripts/auto-dev.mjs --issue <number>      # from GitHub issue
 *   node scripts/auto-dev.mjs --file <path>         # from local requirement file
 *   node scripts/auto-dev.mjs --text "..."          # from inline text
 *
 * Env:
 *   LLM_API_KEY   (required) API key for the LLM provider
 *   LLM_BASE_URL  (optional, default https://api.openai.com/v1)
 *   LLM_MODEL     (optional, default gpt-4o)
 *   GH_TOKEN      (required in CI for gh CLI)
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IGNORE_DIRS = new Set(['node_modules', 'dist', '.git', '.husky', '.github']);
const MAX_FILE_LINES = 400;

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--issue') out.issue = args[++i];
    else if (args[i] === '--file') out.file = args[++i];
    else if (args[i] === '--text') out.text = args[++i];
  }
  return out;
}

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).toString().trim();
}

// ---------------------------------------------------------------------------
// Requirement sources
// ---------------------------------------------------------------------------
function getRequirement(opts) {
  if (opts.text) return opts.text;
  if (opts.file) {
    return readFileSync(resolve(ROOT, opts.file), 'utf8');
  }
  if (opts.issue) {
    const json = sh(`gh issue view ${opts.issue} --json title,body`);
    const { title, body } = JSON.parse(json);
    return `# ${title}\n\n${body}`;
  }
  throw new Error('No requirement source. Use --issue, --file, or --text.');
}

// ---------------------------------------------------------------------------
// Project context
// ---------------------------------------------------------------------------
function listFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) listFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function buildContext() {
  const files = listFiles(ROOT);
  const tree = files.map((f) => relative(ROOT, f).replace(/\\/g, '/')).sort();
  const bundle = [];
  for (const f of files) {
    const rel = relative(ROOT, f).replace(/\\/g, '/');
    if (!/\.(ts|tsx|js|jsx|json|css|html)$/.test(rel)) continue;
    let content;
    try {
      content = readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split('\n');
    if (lines.length > MAX_FILE_LINES) {
      bundle.push(`// === ${rel} (truncated, ${lines.length} lines) ===\n${lines.slice(0, 60).join('\n')}\n// ...`);
    } else {
      bundle.push(`// === ${rel} ===\n${content}`);
    }
  }
  return { tree, bundle: bundle.join('\n\n') };
}

// ---------------------------------------------------------------------------
// LLM call
// ---------------------------------------------------------------------------
async function callLLM(requirement, context) {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) throw new Error('LLM_API_KEY is not set.');
  const baseUrl = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.LLM_MODEL || 'gpt-4o';

  const system = [
    'You are an autonomous senior frontend developer working on a Vite + React 18 + TypeScript project.',
    'Stack: Tailwind CSS, zustand, react-router-dom, framer-motion, three.js (@react-three/fiber).',
    'Follow existing conventions strictly. Use named exports, functional components, and keep changes minimal but complete.',
    'You MUST output ONLY a JSON object, no markdown fences, no prose.',
  ].join('\n');

  const user = [
    'Project file tree:',
    context.tree.join('\n'),
    '',
    'Existing file contents:',
    context.bundle,
    '',
    'Requirement to implement:',
    requirement,
    '',
    'Output schema (return ONLY this JSON):',
    '{',
    '  "commitMessage": "feat: ...",   // conventional commit, no Co-authored-by (added automatically)',
    '  "plan": "short summary of the approach",',
    '  "files": [',
    '    { "path": "src/...", "action": "create" | "modify" | "delete", "content": "FULL file content for create/modify" }',
    '  ]',
    '}',
    'Rules:',
    '- For create/modify provide the COMPLETE final file content, never a diff.',
    '- For delete, omit "content".',
    '- Paths are relative to the project root.',
    '- Do not touch package.json or lockfiles.',
  ].join('\n');

  const url = `${baseUrl}/chat/completions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    throw new Error(`LLM API ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

function extractJSON(text) {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in LLM response.');
  return JSON.parse(t.slice(start, end + 1));
}

// ---------------------------------------------------------------------------
// Apply changes
// ---------------------------------------------------------------------------
function applyChanges(plan) {
  let created = 0, modified = 0, deleted = 0;
  for (const f of plan.files) {
    const abs = resolve(ROOT, f.path);
    if (f.path.includes('..')) throw new Error(`Unsafe path: ${f.path}`);
    if (f.action === 'delete') {
      if (existsSync(abs)) {
        rmSync(abs);
        deleted++;
      }
      continue;
    }
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, f.content ?? '');
    if (f.action === 'create') created++;
    else modified++;
  }
  return { created, modified, deleted };
}

// ---------------------------------------------------------------------------
// Quality gates
// ---------------------------------------------------------------------------
function runGates() {
  const failures = [];
  for (const [name, cmd] of [['lint', 'pnpm lint'], ['type-check', 'pnpm check'], ['build', 'pnpm build']]) {
    try {
      execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      console.log(`[gate] ${name}: pass`);
    } catch (e) {
      console.error(`[gate] ${name}: FAIL\n${e.stdout || ''}\n${e.stderr || ''}`);
      failures.push({ name, log: `${e.stdout || ''}\n${e.stderr || ''}`.slice(0, 4000) });
    }
  }
  return failures;
}

// ---------------------------------------------------------------------------
// Git + PR
// ---------------------------------------------------------------------------
function gitCommitAndPush(branch, message) {
  sh(`git checkout -b ${branch}`);
  execSync('git add -A', { cwd: ROOT, encoding: 'utf8' });
  // Write message to a temp file to preserve formatting + trailer.
  const msgFile = join(ROOT, '.git', 'AUTO_DEV_MSG');
  writeFileSync(msgFile, message);
  execSync(`git commit -F ${msgFile}`, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  execSync(`git push -u origin ${branch}`, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
}

function createPR(branch, title, body) {
  const bodyFile = join(ROOT, '.git', 'AUTO_PR_BODY');
  writeFileSync(bodyFile, body);
  return sh(`gh pr create --head ${branch} --base main --title "${title.replace(/"/g, '\\"')}" --body-file ${bodyFile}`);
}

function commentIssue(issue, body) {
  if (!issue) return;
  const file = join(ROOT, '.git', 'AUTO_ISSUE_COMMENT');
  writeFileSync(file, body);
  sh(`gh issue comment ${issue} --body-file ${file}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const opts = parseArgs();
  const { issue } = opts;

  console.log('[auto-dev] fetching requirement...');
  const requirement = getRequirement(opts);
  console.log(`[auto-dev] requirement length: ${requirement.length} chars`);

  console.log('[auto-dev] building project context...');
  const context = buildContext();

  console.log('[auto-dev] calling LLM...');
  const raw = await callLLM(requirement, context);
  const plan = extractJSON(raw);
  console.log(`[auto-dev] plan: ${plan.plan}`);
  console.log(`[auto-dev] ${plan.files.length} file operations planned.`);

  console.log('[auto-dev] applying changes...');
  const stats = applyChanges(plan);
  console.log(`[auto-dev] created=${stats.created} modified=${stats.modified} deleted=${stats.deleted}`);

  console.log('[auto-dev] running quality gates...');
  const failures = runGates();

  const commitMessage = `${plan.commitMessage || 'feat: auto-dev changes'}

Generated by TRAE AI autonomous pipeline.

Co-authored-by: TRAE AI <noreply@trae.ai>`;

  if (failures.length > 0) {
    const detail = failures.map((f) => `### ${f.name}\n\`\`\`\n${f.log}\n\`\`\``).join('\n\n');
    const body = `⚠️ 自动开发未通过质量门禁。\n\n**Plan:** ${plan.plan}\n\n${detail}`;
    console.error('[auto-dev] gates failed; reporting.');
    if (process.env.CI && issue) commentIssue(issue, body);
    process.exit(1);
  }

  if (!process.env.CI) {
    console.log('[auto-dev] local run: changes applied and gates passed. Review with `git diff`.');
    console.log('[auto-dev] suggested commit message:');
    console.log(commitMessage);
    return;
  }

  const branch = issue ? `auto/issue-${issue}` : `auto/${Date.now()}`;
  console.log(`[auto-dev] committing to ${branch}...`);
  gitCommitAndPush(branch, commitMessage);

  const prBody = [
    `## 自动开发 PR`,
    '',
    `**关联 Issue:** ${issue ? `#${issue}` : 'N/A'}`,
    '',
    `### 实现方案`,
    plan.plan,
    '',
    `### 改动文件 (${plan.files.length})`,
    plan.files.map((f) => `- \`${f.action}\` \`${f.path}\``).join('\n'),
    '',
    '---',
    '_由 TRAE AI 自动化流水线生成，请验收后合并。_',
  ].join('\n');

  const prUrl = createPR(branch, plan.commitMessage || 'feat: auto-dev changes', prBody);
  console.log(`[auto-dev] PR created: ${prUrl}`);
  if (issue) commentIssue(issue, `✅ 自动开发完成，请验收: ${prUrl}`);
}

main().catch((e) => {
  console.error('[auto-dev] fatal:', e.message);
  if (process.env.CI && process.argv.includes('--issue')) {
    try { commentIssue(parseArgs().issue, `❌ 自动开发异常: ${e.message}`); } catch {}
  }
  process.exit(1);
});
