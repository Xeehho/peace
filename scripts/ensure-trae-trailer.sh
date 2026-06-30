#!/usr/bin/env bash
# Ensure every commit between base and HEAD carries the TRAE AI Co-authored-by trailer.
# If any commit is missing it, rebase to add the trailer and force-push the PR branch.
# Usage: scripts/ensure-trae-trailer.sh <base-ref> <head-ref>
set -euo pipefail

BASE="${1:?base ref required}"
HEAD_REF="${2:?head ref required}"
TRAILER='Co-authored-by: TRAE AI <noreply@trae.ai>'

git fetch origin "$BASE"
BASE_SHA="origin/$BASE"

missing=0
for sha in $(git rev-list "$BASE_SHA..HEAD"); do
  if ! git log -1 --format='%B' "$sha" | grep -qF 'Co-authored-by: TRAE AI'; then
    missing=1
    break
  fi
done

if [ "$missing" -eq 0 ]; then
  echo "::notice::All commits already carry the TRAE trailer."
  exit 0
fi

echo "::notice::Some commits are missing the TRAE trailer; rebasing to add it."
git config user.name "TRAE AI Bot"
git config user.email "noreply@trae.ai"

git rebase "$BASE_SHA" --exec '
  if ! git log -1 --format=%B | grep -qF "Co-authored-by: TRAE AI"; then
    git commit --amend --no-edit -m "$(git log -1 --pretty=%B)" -m "Co-authored-by: TRAE AI <noreply@trae.ai>"
  fi
'

git push --force-with-lease origin "HEAD:$HEAD_REF"
echo "::notice::Force-pushed $HEAD_REF with TRAE trailers applied."
