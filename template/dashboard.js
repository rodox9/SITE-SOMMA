// Lógica genérica do dashboard
// Carrega data.json do cliente, mescla com DASHBOARD_DEFAULTS,
// e renderiza os painéis.
//
// SUBSTITUIR a função renderizarDashboard() pela versão real do
// dashboard a.gonçalves aprovado. A estrutura abaixo é só um esqueleto
// que mostra o fluxo correto.

(async function () {
  const status = (msg) => console.log("[dashboard]", msg);

  // 1) Carrega data.json do cliente (na mesma pasta que o index.html)
  let data;
  try {
    const resp = await fetch("./data.json", { cache: "no-cache" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    data = await resp.json();
  } catch (err) {
    document.body.innerHTML =
      `<p style="padding:2rem">Erro ao carregar data.json: ${err.message}</p>`;
    return;
  }

  // 2) Merge com defaults
  const defaults = window.DASHBOARD_DEFAULTS || {};
  const cfg = {
    cliente:         data.cliente         || "Cliente",
    incorporadoras:  data.incorporadoras  || [],
    produtos:        data.produtos        || defaults.produtos        || [],
    objetivoCamp:    { ...defaults.objetivoCamp, ...(data.objetivoCamp    || {}) },
    CORES:           { ...defaults.CORES,        ...(data.CORES           || {}) },
    metaProdutoLead: { ...defaults.metaProdutoLead, ...(data.metaProdutoLead || {}) },
    campanhas:       data.campanhas       || [],
    dataAtualizacao: data.dataAtualizacao || new Date().toISOString().slice(0,10),
  };

  // 3) Atualiza header
  document.getElementById("cliente-nome").textContent = cfg.cliente;
  document.getElementById("cliente-titulo").textContent =
    `Dashboard de Meta Ads — ${cfg.cliente}`;
  document.getElementById("template-version").textContent =
    defaults.templateVersion || "—";
  document.getElementById("data-updated").textContent = cfg.dataAtualizacao;

  // 4) Renderiza painel de campanhas (ATIVAS/INATIVAS)
  renderizarCampanhas(cfg);

  // 5) Renderiza painel de leads
  renderizarLeads(cfg);

  // 6) Renderiza painel de custo
  renderizarCusto(cfg);

  status("dashboard renderizado");
})();

// ===================================================================
// SUBSTITUA as funções abaixo pela lógica real do dashboard aprovado
// ===================================================================

function renderizarCampanhas(cfg) {
  const ativas   = cfg.campanhas.filter(c => c.status === "ativa");
  const inativas = cfg.campanhas.filter(c => c.status !== "ativa");

  // Conta produtos ativos
  const produtosAtivos   = new Set(ativas.map(c => c.produto));
  const produtosInativos = new Set(inativas.map(c => c.produto));

  document.getElementById("campanhas-ativas-badge").textContent =
    `Ativas: ${produtosAtivos.size} produtos · ${ativas.length} campanhas`;
  document.getElementById("campanhas-inativas-badge").textContent =
    `Inativas: ${produtosInativos.size} produtos · ${inativas.length} campanhas`;

  // Pills por produto ativo, com badge de nº de campanhas
  const grid = document.getElementById("campanhas-grid");
  grid.innerHTML = "";
  for (const produto of produtosAtivos) {
    const n = ativas.filter(c => c.produto === produto).length;
    const cor = cfg.CORES[produto] || "#888";
    const pill = document.createElement("div");
    pill.className = "produto-pill";
    pill.style.borderColor = cor;
    pill.innerHTML = `<strong>${produto}</strong> · ${n} camp.`;
    grid.appendChild(pill);
  }
}

function renderizarLeads(cfg) {
  // TODO: copiar lógica real do dashboard a.gonçalves aprovado
  const grid = document.getElementById("leads-grid");
  grid.innerHTML = "<p>(painel de leads — substituir pela versão final)</p>";
}

function renderizarCusto(cfg) {
  // TODO: copiar lógica real do dashboard a.gonçalves aprovado
  const grid = document.getElementById("custo-grid");
  grid.innerHTML = "<p>(painel de custo — substituir pela versão final)</p>";
}
