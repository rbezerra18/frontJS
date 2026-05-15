#!/usr/bin/env bash
# deploy-gh-pages.sh
# Script POSIX/Bash para desplegar contenido a la rama gh-pages.
# Uso: ./deploy-gh-pages.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TMP_DIR="/tmp/gh-pages-deploy-$$"

REMOTE_URL=$(git -C "$SCRIPT_DIR" remote get-url origin || true)
if [ -z "$REMOTE_URL" ]; then
  echo "No se encontró remote 'origin'. Configura el remote y vuelve a intentarlo." >&2
  exit 1
fi

rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

# Excluir .git y scripts
rsync -av --exclude='.git' --exclude='deploy-gh-pages.sh' --exclude='deploy-gh-pages.ps1' --exclude='.github' "$SCRIPT_DIR/" "$TMP_DIR/"

pushd "$TMP_DIR" >/dev/null
git init
git checkout -b gh-pages
git add .
if git commit -m "Deploy site to gh-pages" >/dev/null 2>&1; then
  :
else
  echo "Advertencia: no hay cambios para commitear."
fi
git remote add origin "$REMOTE_URL"
git push --force origin gh-pages

# Crear .nojekyll
if [ ! -f .nojekyll ]; then
  touch .nojekyll
  git add .nojekyll
  git commit -m "Add .nojekyll" || true
  git push --force origin gh-pages
fi

popd >/dev/null
echo "Despliegue completado: se subió a 'gh-pages' en $REMOTE_URL"
