# Passo a passo — Do zero ao deploy

Estrutura simples: hub central + pasta por cliente + senha SHA-256 + deploy estático no GitHub Pages que você já tem.

## Fase 0 · Pré-requisitos (já tem)

- [x] Repo `rodox9/SITE-SOMMA`
- [x] GitHub Pages ativo
- [x] Domínio `dash.sommainc.com.br` via CNAME
- [ ] Git instalado localmente (`git --version`)

## Fase 1 · Clonar o repo

```bash
cd ~
git clone https://github.com/rodox9/SITE-SOMMA.git
cd SITE-SOMMA
```

## Fase 2 · Aplicar o scaffold

Copie o conteúdo de `dashboards-repo/` (entregue pela Cowork) por cima do repo:

```bash
# Substitua <caminho> pela pasta de outputs
cp -r <caminho>/dashboards-repo/. ~/SITE-SOMMA/
cd ~/SITE-SOMMA
git status
```

Você verá:
- `index.html` atualizado (hub novo com cards)
- `gerar-senha.html` novo
- `template/` novo (com gate.js, gate.css, dashboard.*)
- `agoncalves/` novo (com index.html protegido + data.json)
- `README.md` atualizado
- `PASSO-A-PASSO.md` (este arquivo)

> O arquivo legado `dashboard_agoncalves_maio1.html` **não foi tocado**.

## Fase 3 · Gerar a senha do A.Gonçalves

Antes de qualquer push, defina a senha. Tem 2 jeitos:

**A) Abrir o utilitário local:**

```bash
open gerar-senha.html  # macOS
# ou: xdg-open gerar-senha.html
```

Digite uma senha forte (ex: `Somma2026!Performance`), clique em "Gerar hash", copie o hash de 64 caracteres.

**B) Direto pelo console do navegador** (DevTools → Console):

```js
crypto.subtle.digest("SHA-256", new TextEncoder().encode("SUA-SENHA-AQUI"))
  .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,"0")).join("")))
```

Em qualquer caso, abra `agoncalves/index.html` e substitua:

```html
<meta name="dashboard-password-hash" content="SUBSTITUA-AQUI-PELO-HASH-GERADO-EM-GERAR-SENHA-HTML">
```

por:

```html
<meta name="dashboard-password-hash" content="o-hash-de-64-caracteres-que-você-copiou">
```

**Anote a senha (não o hash)** num lugar seguro pra enviar ao cliente.

## Fase 4 · Trazer o HTML aprovado do chat

O dashboard atual no GitHub é a versão antiga (sem MONTEZ, HÁZ, GARDENS). Você precisa pegar o HTML corrigido:

1. Abra: <https://claude.ai/share/f973c962-f250-45d7-b654-4b45395c54e4>
2. Vá até a **última mensagem do assistente** (a versão final aprovada)
3. Baixe o arquivo HTML gerado

Você tem duas opções de como integrar esse HTML:

**Opção rápida (1 hora):** cole o HTML inteiro em `agoncalves/index.html` substituindo todo o `<body>` e `<head>` — mas mantenha:
- a `<meta name="dashboard-client-id">`
- a `<meta name="dashboard-password-hash">`
- o `<link>` e `<script>` do `gate.css` / `gate.js`

**Opção arrumada (3-4 horas):** separe em template + data conforme `README.md`:
- estrutura HTML genérica → `template/dashboard.html`
- estilos → `template/dashboard.css`
- lógica de render → `template/dashboard.js`
- `objetivoCamp`, `CORES`, `produtos`, `metaProdutoLead`, campanhas → `agoncalves/data.json`

Recomendo a **opção rápida primeiro** (subir e ver no ar), depois refatorar pra opção arrumada quando for adicionar o segundo cliente.

## Fase 5 · Testar local

```bash
cd ~/SITE-SOMMA
python3 -m http.server 8000
```

Abra <http://localhost:8000/>:
- Hub aparece com card do A.Gonçalves
- Clica no card → pede senha
- Senha errada → "Senha incorreta"
- Senha certa → mostra dashboard

Se algo não funciona, abra DevTools → Console e procure erros.

## Fase 6 · Commit + push

```bash
git add .
git commit -m "Estrutura hub+clientes com password gate"
git push origin main
```

GitHub Pages publica em ~30s.

## Fase 7 · Testar em produção

Abra:
- <https://dash.sommainc.com.br/> → hub
- <https://dash.sommainc.com.br/agoncalves/> → dashboard (com senha)

## Fase 8 · Adicionar cliente novo (rotina)

```bash
cd ~/SITE-SOMMA

# 1. Duplica
cp -r agoncalves novocliente

# 2. Gera senha em gerar-senha.html, edita novocliente/index.html
#    (troca client-id e password-hash)

# 3. Edita novocliente/data.json com os dados

# 4. Adiciona <a class="card"> no index.html raiz

# 5. Push
git add . && git commit -m "Add cliente novocliente" && git push
```

URL fica disponível em ~30s.

## Fase 9 · Atualizar o template (rotina)

Quando quiser mudar algo que afeta TODOS os clientes:

```bash
cd ~/SITE-SOMMA
vim template/dashboard.js  # ou .html, .css
python3 -m http.server 8000  # testa local
git add template/ && git commit -m "Template: <descrição>" && git push
```

Todos os clientes recebem em ~30s.

---

## Troubleshooting

| Sintoma                                   | Causa provável                                  | Fix                                                         |
|-------------------------------------------|-------------------------------------------------|-------------------------------------------------------------|
| Gate aparece mas senha correta não passa  | Hash do meta tag não bate                       | Regere o hash em `gerar-senha.html`, cole novamente         |
| Página em branco                          | Erro em JS                                      | DevTools → Console                                          |
| `data.json` não carrega                   | JSON inválido                                   | Validar em jsonlint.com                                     |
| Caminho dos arquivos quebrado             | Cliente fora da pasta `/agoncalves/`            | Confirmar `../template/` (dois pontos)                      |
| Cache do GitHub Pages                     | Mudança não aparece após push                   | Aguardar até 10min ou Cmd+Shift+R                           |
| Cliente vê dados de outro                 | `data.json` errado na pasta                     | Recopia do correto                                          |
| "Mas alguém pode ver o hash no source"    | Sim, pode                                       | Use senha LONGA e ÚNICA. Para dados super sensíveis → SaaS  |

## Próximos passos quando crescer

Quando tiver 5+ clientes ou alguém pedir login real:
- Migrar para Next.js + Supabase Auth (mantendo `data.json` por cliente como ponto de partida)
- Subdomínio por cliente (`somma.dash.com.br`, `auraz.dash.com.br`)
- Histórico de versões dos dashboards
- Branding por cliente

Mas isso é Fase 2/3 — primeiro valida o uso real.
