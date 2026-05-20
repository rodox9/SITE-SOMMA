# Arquitetura recomendada — Dashboards de Incorporadoras

## O problema

Você tem um dashboard HTML (Meta Ads para incorporadoras) e quer:

1. Hospedar num GitHub com Pages.
2. Que **todos os clientes recebam updates automáticos** quando você atualizar o template.
3. Que cada cliente tenha **seus próprios dados** (produtos, campanhas, CORES, objetivoCamp, metas).

## Recomendação: Template único + dados por cliente

A forma mais simples e escalável é separar **template** (HTML + JS) de **dados** (JSON por cliente).

```
seu-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Action: deploy automático no Pages
│
├── template/                        # ← O MODELO. Atualizar aqui = todos clientes recebem
│   ├── dashboard.html              # estrutura HTML
│   ├── dashboard.css               # estilos
│   ├── dashboard.js                # lógica do dashboard (lê data.json do cliente)
│   └── config.default.js           # configs padrão de objetivoCamp, CORES, etc.
│
├── clientes/                        # ← Um folder por cliente
│   ├── agoncalves/
│   │   ├── index.html              # carrega ../template/ + data.json local
│   │   └── data.json               # produtos, campanhas, metas DO CLIENTE
│   ├── cliente2/
│   │   ├── index.html
│   │   └── data.json
│   └── ...
│
├── index.html                       # landing com seletor de cliente
└── README.md                        # instruções
```

### Como funciona o auto-update

- **Cada `clientes/X/index.html` é um shim curto** que carrega `../template/dashboard.html`, `../template/dashboard.js` e o `data.json` local.
- Quando você faz `git push` no `template/`, **todos os dashboards de clientes são atualizados automaticamente** — eles só apontam para os arquivos compartilhados.
- O GitHub Pages é estático, então não precisa rebuild, deploy ou nada — o push já é o deploy.

### URLs finais (com GitHub Pages ativo)

| Cliente       | URL                                                       |
|---------------|-----------------------------------------------------------|
| Landing       | `https://USUARIO.github.io/REPO/`                         |
| A.Gonçalves   | `https://USUARIO.github.io/REPO/clientes/agoncalves/`     |
| Cliente 2     | `https://USUARIO.github.io/REPO/clientes/cliente2/`       |

### Vantagens

- **1 mudança no template → todos clientes** atualizados.
- **Versionamento Git completo** (rollback, diff, branches por experimento).
- **Sem build, sem CI complexo** — Pages serve o estático direto.
- Acesso restrito por **URL secreta** (cada cliente só sabe a dele) — opcionalmente combinar com Pages privado se for plano Enterprise.

### Quando NÃO usar essa arquitetura

- Se cada cliente precisa de **template diferente** (não só dados diferentes): use branches ou repos separados.
- Se os dados são **sensíveis** e não podem ficar em repo público: use Pages privado (paid) ou hospede em outro lugar (Cloudflare Pages, Vercel).

## Alternativa: Claude Plugin Marketplace

Se o "modelo" for uma **skill do Claude** (não um HTML estático), a forma correta é um **plugin marketplace** Git:

```
seu-repo/
└── .claude-plugin/
    └── marketplace.json            # catálogo de plugins
└── plugins/
    └── dashboard-incorporadora/
        ├── plugin.json
        └── skills/
            └── dashboard-gen/
                └── SKILL.md
```

Clientes instalam uma vez com `/plugin marketplace add USUARIO/REPO` no Claude Code/Cowork, e recebem updates com `/plugin marketplace update`.

Diga se é esse o caminho que prefere — eu já tenho a skill `cowork-plugin-management:create-cowork-plugin` que monta tudo isso automaticamente.

## Próximo passo

Decida:

1. **HTML template + Pages** (Opção A) — recomendado se "modelo" = arquivo HTML do dashboard.
2. **Plugin marketplace do Claude** (Opção B) — recomendado se "modelo" = skill/workflow que GERA os dashboards.

Já deixei o scaffold da Opção A pronto na pasta — é só copiar o HTML do dashboard para `template/dashboard.html` e dar `git push`.
