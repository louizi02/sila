#!/usr/bin/env sh
# Construit Sila et publie dist/ sur la branche gh-pages (GitHub Pages).
set -e
cd "$(dirname "$0")/.."

npm run build
touch dist/.nojekyll

remote=$(git remote get-url origin)
cd dist
rm -rf .git
git init -q
git checkout -q -b gh-pages
git add -A
git commit -q -m "Publier Sila"
git push -f "$remote" gh-pages
rm -rf .git
