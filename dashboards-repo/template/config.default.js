// Configs PADRÃO usados quando o cliente não sobrescreve em data.json
// SUBSTITUA os valores abaixo pelos da sua versão final (objetivoCamp,
// CORES, produtos) — extraídos do dashboard a.gonçalves aprovado.

window.DASHBOARD_DEFAULTS = {
  // Versão do template — bump manual quando fizer breaking change
  templateVersion: "1.0.0",

  // Mapeamento padrão de objetivos de campanha → categoria
  // Substitua pelos valores reais (GARDENS, ANDERSEN, INSTITUCIONAL,
  // 5 MILHÕES, COMERCIAIS, etc.)
  objetivoCamp: {
    // exemplo:
    // "GARDENS": "lancamento",
    // "ANDERSEN": "obra",
    // "INSTITUCIONAL": "branding",
  },

  // Paleta de cores por produto
  // Substitua pelos valores reais da sua versão aprovada
  CORES: {
    // "GARDENS":      "#2E7D32",
    // "ANDERSEN":     "#1565C0",
    // "INSTITUCIONAL":"#6A1B9A",
  },

  // Lista de produtos padrão (cada cliente pode ter os seus em data.json)
  produtos: [
    // exemplo: { id: "GARDENS", nome: "Gardens", incorporadora: "X" }
  ],

  // Metas padrão (leads/CPL) por produto
  metaProdutoLead: {
    // "GARDENS": { leads: 100, cpl: 80 },
  },
};
