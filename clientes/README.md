# Pipeline de Dashboards Meta Ads

## Estrutura

```
dashboards-repo/
├── csv-input/          ← COLOQUE O CSV AQUI (qualquer cliente)
├── csv-archive/        ← CSVs processados (com timestamp)
│
├── clientes/configs/   ← YAML de cada cliente (metas, produtos, cores)
│   ├── vkr.yaml
│   ├── agoncalves.yaml
│   └── ...
│
└── <cliente>/index.html  ← dashboard publicado (raiz do repo)
    ├── vkr/index.html
    ├── hype/index.html
    └── ...
```

## Como usar

1. **Exporte o CSV** do Meta Ads (Gerenciador → Exportar → Por Tempo → Mês, Nível Campanha)
2. **Salve em `csv-input/`** com nome que identifique o cliente. Exemplos válidos:
   - `vkr-mai2026.csv`
   - `RELATORIO-VKR-2026-05.csv`
   - `hype_curitiba_maio.csv`
   - `agoncalves abril 2026.csv`
3. **Peça ao Claude**: *"atualizar dashboards"* (processa tudo de `csv-input/`)
   ou *"atualizar dashboard vkr"* (processa só esse cliente)

## Reconhecimento por nome de arquivo

A skill identifica o cliente por palavras-chave no nome
(case-insensitive, ignora acentos, ignora espaços/hífens/underscores).

| Cliente oficial | Aliases aceitos no nome do CSV |
|---|---|
| VKR Empreendimentos | `vkr`, `vkr-incorporadora`, `vkr-empreendimentos` |
| A. Gonçalves | `goncalves`, `agoncalves`, `a-goncalves`, `a.goncalves` |
| Hype Inc | `hype`, `hyperion`, `hype-inc`, `hype-curitiba` |
| Fresta | `fresta` |
| H2B Imóveis | `h2b`, `h2b-imoveis` |
| TreeHaus Imóveis | `treehaus`, `treehauss`, `tree-haus`, `treehaus-imoveis` |
| Bossa | `bossa` |

**Regras de matching**:
- Match parcial dentro do nome do arquivo (ex: `RELATORIO-MENSAL-HYPERION-MAI26.csv` → Hype)
- Acentos, espaços, hífens, underscores e pontos são ignorados
- Se bater com mais de um cliente, a skill pergunta antes de processar
- Se não bater com nenhum, a skill pergunta qual cliente é (ou aborta se você disser "skip")

## O que a skill faz

- Lê todos os CSVs de `csv-input/`
- Identifica o cliente por cada nome
- Aplica regras do `clientes/configs/<cliente>.yaml`
- Gera/atualiza `<cliente>/index.html` na raiz
- Move o CSV para `csv-archive/<cliente>-AAAA-MM-DD-HHMM.csv`
- Valida totais e reporta campanhas não mapeadas
