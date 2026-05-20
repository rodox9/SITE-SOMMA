# SITE-SOMMA — Dashboards de Performance

Hub de dashboards de Meta Ads por incorporadora, em GitHub Pages com domínio custom `dash.sommainc.com.br`.

## Arquitetura

```
SITE-SOMMA/
├── CNAME                            # dash.sommainc.com.br
├── index.html                       # hub: cards de todos os clientes
├── gerar-senha.html                 # utilitário para gerar hash SHA-256
│
├── template/                        # MODELO COMPARTILHADO (auto-update)
│   ├── dashboard.html              # estrutura base
│   ├── dashboard.css               # estilos
│   ├── dashboard.js                # lógica (lê data.json do cliente)
│   ├── config.default.js           # CORES/objetivoCamp/metas padrão
│   ├── gate.js                     # password gate (SHA-256)
│   └── gate.css                    # estilo do gate
│
├── agoncalves/                      # UM FOLDER POR CLIENTE
│   ├── index.html                  # com <meta dashboard-password-hash="...">
│   └── data.json                   # dados do cliente
│
└── dashboard_agoncalves_maio1.html  # versão antiga (legado)
```

## Como funciona

- **Hub**: `dash.sommainc.com.br` → lista de clientes em cards
- **Cliente**: `dash.sommainc.com.br/agoncalves/` → pede senha → mostra dashboard
- **Auto-update**: ao editar `template/*` e dar `git push`, **todos os clientes recebem a nova versão** (eles carregam os arquivos compartilhados via `<script>` relativo)

## Segurança

Proteção por senha SHA-256 no client-side. Bom para:
- ✅ Dashboards de cliente com dados moderadamente sensíveis (métricas, performance)
- ✅ MVP, validação, primeiro deploy

Não use para:
- ❌ Dados ALTAMENTE sensíveis (financeiros, PII, contratos)
- ❌ Produto profissional com governança

Quando precisar evoluir, migrar para SaaS multi-tenant (Next.js + Supabase Auth) — a estrutura de pastas atual facilita a migração porque os dados de cada cliente já estão isolados em `data.json`.

## Como adicionar um cliente novo

1. **Gere a senha:** abra `dash.sommainc.com.br/gerar-senha.html`, digite uma senha forte, copie o hash SHA-256
2. **Duplique a pasta:** `cp -r agoncalves novocliente`
3. **Edite `novocliente/index.html`:**
   - troque `dashboard-client-id` para `novocliente`
   - cole o hash gerado em `dashboard-password-hash`
   - ajuste o título e `cliente-nome` no rodapé
4. **Edite `novocliente/data.json`** com os dados do cliente
5. **Adicione um `<a class="card">`** no `index.html` raiz apontando para `./novocliente/`
6. `git add . && git commit -m "Add cliente novocliente" && git push`
7. URL ativa em ~30s: `dash.sommainc.com.br/novocliente/`

## Como atualizar o modelo (afeta TODOS os clientes)

```bash
# Edite qualquer arquivo em template/
vim template/dashboard.js
# Push
git add template/ && git commit -m "Update template: <descrição>" && git push
```

Todos os clientes recebem a atualização em ~30s. Não precisa tocar nas pastas dos clientes.

## Como trocar a senha de um cliente

1. Abra `dash.sommainc.com.br/gerar-senha.html`
2. Digite a nova senha, copie o hash
3. Edite `agoncalves/index.html` (ou da pasta do cliente)
4. Substitua o valor do `<meta name="dashboard-password-hash">`
5. `git commit && git push`
6. Envie a nova senha ao cliente (a antiga deixa de funcionar)

## URLs finais

| Página           | URL                                                          |
|------------------|--------------------------------------------------------------|
| Hub              | `https://dash.sommainc.com.br/`                              |
| A.Gonçalves      | `https://dash.sommainc.com.br/agoncalves/`                   |
| Gerar senha      | `https://dash.sommainc.com.br/gerar-senha.html`              |
| Legado           | `https://dash.sommainc.com.br/dashboard_agoncalves_maio1.html` |
