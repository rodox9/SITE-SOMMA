#!/usr/bin/env bash
# deploy.sh — clona SITE-SOMMA, aplica o scaffold e dá push
#
# Uso:
#   bash "/Users/rodoxnine/Library/Application Support/Claude/local-agent-mode-sessions/7aba7596-581b-4bf9-8cc5-fa040eaee32e/be56a5d3-61e6-499d-83d0-1c51efe46761/local_e81ab96b-9284-4919-a138-355f99167bfb/outputs/deploy.sh"
#
# Pré-requisitos: git instalado e autenticado com permissão de push no
# repositório rodox9/SITE-SOMMA (SSH key ou GitHub CLI já configurado).

set -euo pipefail

SCAFFOLD="/Users/rodoxnine/Library/Application Support/Claude/local-agent-mode-sessions/7aba7596-581b-4bf9-8cc5-fa040eaee32e/be56a5d3-61e6-499d-83d0-1c51efe46761/local_e81ab96b-9284-4919-a138-355f99167bfb/outputs/dashboards-repo"
REPO_URL="https://github.com/rodox9/SITE-SOMMA.git"
WORKDIR="${HOME}/SITE-SOMMA"
BRANCH="main"
COMMIT_MSG="Scaffold hub+clientes com password gate (template compartilhado)"

echo ""
echo "==> Verificando scaffold em:"
echo "    $SCAFFOLD"
if [ ! -d "$SCAFFOLD" ]; then
  echo "ERRO: pasta do scaffold não encontrada. Cancele e me avise." >&2
  exit 1
fi

echo ""
echo "==> Clonando ou atualizando $WORKDIR"
if [ -d "$WORKDIR/.git" ]; then
  cd "$WORKDIR"
  # Salva qualquer mudança local antes de puxar (não perde nada — fica em stash)
  if [ -n "$(git status --porcelain)" ]; then
    STASH_NAME="deploy.sh autosave $(date +%Y%m%d-%H%M%S)"
    echo "    ! mudanças locais detectadas — salvando em stash: $STASH_NAME"
    git stash push --include-untracked -m "$STASH_NAME" || true
  fi
  git fetch origin
  git checkout "$BRANCH"
  git pull --rebase origin "$BRANCH"
else
  rm -rf "$WORKDIR"
  git clone "$REPO_URL" "$WORKDIR"
  cd "$WORKDIR"
fi

echo ""
echo "==> Aplicando scaffold (sem tocar em dashboard_agoncalves_maio1.html)"
# rsync preserva o legado e copia tudo do scaffold por cima
rsync -av --exclude='.git/' "$SCAFFOLD/" "$WORKDIR/"

echo ""
echo "==> Estrutura resultante:"
find "$WORKDIR" -maxdepth 3 -type f -not -path "*/.git/*" | sort

echo ""
echo "==> Diferenças (resumo):"
git -C "$WORKDIR" status --short

echo ""
read -p "Confirma o commit + push em $REPO_URL ? [y/N] " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo "Cancelado. Mudanças continuam na pasta $WORKDIR — você pode revisar/ajustar e dar push manual depois."
  exit 0
fi

echo ""
echo "==> Commit + push"
git -C "$WORKDIR" add .
git -C "$WORKDIR" commit -m "$COMMIT_MSG"
git -C "$WORKDIR" push origin "$BRANCH"

echo ""
echo "==> Pronto! GitHub Pages publica em ~30s. URLs:"
echo "    Hub          : https://dash.sommainc.com.br/"
echo "    A.Gonçalves  : https://dash.sommainc.com.br/agoncalves/"
echo "    Gerar senha  : https://dash.sommainc.com.br/gerar-senha.html"
echo "    Legado       : https://dash.sommainc.com.br/dashboard_agoncalves_maio1.html"
echo ""
echo "LEMBRE-SE: o agoncalves/index.html ainda tem hash placeholder."
echo "Antes de mandar ao cliente, abra /gerar-senha.html, gere o hash"
echo "real e substitua no arquivo. Depois dê outro push."
