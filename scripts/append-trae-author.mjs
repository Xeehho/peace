#!/usr/bin/env node
// Append Co-authored-by TRAE AI trailer to a commit message if missing.
// Usage: node scripts/append-trae-author.mjs <commit-msg-file>
import { readFileSync, writeFileSync } from 'node:fs';

const TRAE_TRAILER = 'Co-authored-by: TRAE AI <noreply@trae.ai>';
const msgFile = process.argv[2];

if (!msgFile) {
  console.error('[trae] no commit message file provided');
  process.exit(1);
}

let raw = readFileSync(msgFile, 'utf8');

// Skip merge commits
if (raw.startsWith('Merge') || raw.startsWith('Revert')) {
  process.exit(0);
}

if (raw.includes('Co-authored-by: TRAE AI')) {
  process.exit(0);
}

// Trim trailing whitespace/newlines, ensure a blank line separates trailers from body
const trimmed = raw.replace(/\s+$/, '');
const separator = trimmed.includes('\n\n') ? '\n' : '\n\n';
const next = `${trimmed}${separator}${TRAE_TRAILER}\n`;

writeFileSync(msgFile, next);
console.log('[trae] appended Co-authored-by trailer');
