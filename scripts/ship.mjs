#!/usr/bin/env node
/**
 * Ship script — post-development automation.
 *
 * Run AFTER the TRAE IDE assistant has implemented the code changes.
 * Executes quality gates (lint / type-check / build), commits with a
 * conventional message (the commit-msg hook auto-appends the TRAE AI
 * co-author trailer), pushes a branch, and opens a PR.
 *
 * Usage:
 *   node scripts/ship.mjs --message "feat: add war filter" [--branch auto/feat] [--issue 12]
 *
 * The assistant workflow:
 *   1. You give the assistant a requirement (file or description).
 *   2. The assistant implements the code (Edit/Write tools).
 *   3. The assistant runs: pnpm ship --message "feat: ..." [--issue N]
 *   4. You review the PR = 验收.
 */
import { execSync } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--message') out.message = args[++i];
    else if (args[i] === '--branch') out.branch = args[++i];
    else if (args[i] === '--issue') out.issue = args[++i];
    else if (args[i] === '--base') out.base = args[++i];
  }
  return out;
}

function sh(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
}

function run(cmd) {
  execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'inherit' });
}

// ---------------------------------------------------------------------------
// Quality gates
// ---------------------------------------------------------------------------
function runGates() {
  const failures = [];
  for (const [name, cmd] of [['lint', 'pnpm lint'], ['type-check', 'pnpm check'], ['build', 'pnpm build']]) {
    try {
      execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
      console.log(`[ship] ${name}: pass`);
    } catch (e) {
      const log = `${e.stdout || ''}\n${e.stderr || ''}`.slice(0, 6000);
      console.error(`[ship] ${name}: FAIL\n${log}`);
      failures.push({ name, log });
    }
  }
  return failures;
}

// ---------------------------------------------------------------------------
// Git + PR
// ---------------------------------------------------------------------------
function currentBranch() {
  return sh('git rev-parse --abbrev-ref HEAD');
}

function hasStagedOrUnstaged() {
  const status = sh('git status --porcelain');
  return status.length > 0;
}

function commitPushPR(message, branch, base, issue) {
  const cur = currentBranch();
  if (cur === base || cur === 'main' || cur === 'master') {
    // create a feature branch off the current base
    sh(`git checkout -b ${branch}`);
  } else {
    // already on a feature branch; reuse it
    branch = cur;
  }

  run('git add -A');

  const msgFile = join(ROOT, '.git', 'SHIP_MSG');
  writeFileSync(msgFile, message);
  run(`git commit -F ${msgFile}`);

  run(`git push -u origin ${branch}`);

  const bodyLines = [
    '## 自动开发 PR',
    '',
    issue ? `**关联 Issue:** #${issue}` : '',
    '',
    '---',
    '_由 TRAE IDE 内置模型开发，自动化流水线发货。请验收后合并。_',
  ].filter(Boolean);
  const bodyFile = join(ROOT, '.git', 'SHIP_BODY');
  writeFileSync(bodyFile, bodyLines.join('\n'));

  const title = message.split('\n')[0];
  const prUrl = sh(`gh pr create --head ${branch} --base ${base} --title "${title.replace(/"/g, '\\"')}" --body-file ${bodyFile}`);
  return { prUrl, branch };
}

function commentIssue(issue, body) {
  if (!issue) return;
  const file = join(ROOT, '.git', 'SHIP_COMMENT');
  writeFileSync(file, body);
  sh(`gh issue comment ${issue} --body-file ${file}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  const opts = parseArgs();
  if (!opts.message) {
    console.error('[ship] --message is required (e.g. "feat: add war filter")');
    process.exit(1);
  }
  const base = opts.base || 'main';

  if (!hasStagedOrUnstaged()) {
    console.error('[ship] no changes to ship. Implement the requirement first.');
    process.exit(1);
  }

  console.log('[ship] running quality gates...');
  const failures = runGates();

  if (failures.length > 0) {
    console.error(`[ship] ${failures.length} gate(s) failed. Fix before shipping.`);
    process.exit(1);
  }

  const branch = opts.branch || (opts.issue ? `auto/issue-${opts.issue}` : `auto/${Date.now()}`);
  console.log(`[ship] committing & pushing to ${branch}...`);
  const { prUrl } = commitPushPR(opts.message, branch, base, opts.issue);

  console.log(`[ship] PR created: ${prUrl}`);
  if (opts.issue) commentIssue(opts.issue, `✅ 已实现并提交，请验收: ${prUrl}`);
  console.log('[ship] done. Awaiting your review (验收).');
}

main();
