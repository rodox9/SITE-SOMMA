// Password gate — proteção client-side com hash SHA-256.
//
// USO: cada cliente define um <meta name="dashboard-password-hash" content="...">
// no <head> do seu index.html. Sem hash configurado = sem gate (acesso aberto).
//
// LIMITAÇÕES:
// - É proteção client-side: qualquer pessoa pode ver o hash no source.
// - Se a senha for fraca (palavra comum), pode ser quebrada por força bruta offline.
// - Não use para dados ALTAMENTE sensíveis. Para isso → SaaS com auth real.
// - Para MVP / dashboards de cliente com dados moderadamente sensíveis, serve bem.
//
// COMO GERAR O HASH:
// No console do navegador (ou node), rode:
//   crypto.subtle.digest("SHA-256", new TextEncoder().encode("sua-senha")).then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,"0")).join("")))
// Cole o resultado no <meta name="dashboard-password-hash" content="...">

(function () {
  const meta = document.querySelector('meta[name="dashboard-password-hash"]');
  const expectedHash = meta ? meta.content.trim().toLowerCase() : "";

  // Se não há hash configurado, libera acesso direto
  if (!expectedHash) {
    document.documentElement.dataset.gate = "open";
    return;
  }

  // Já autenticado nessa sessão? (sessionStorage por client_id)
  const clientId = document.querySelector('meta[name="dashboard-client-id"]')?.content
                || location.pathname.split("/").filter(Boolean)[0]
                || "cliente";
  const sessionKey = "dashboard-auth-" + clientId;
  if (sessionStorage.getItem(sessionKey) === expectedHash) {
    document.documentElement.dataset.gate = "open";
    return;
  }

  // Senão, monta a UI do gate ANTES de qualquer outro script renderizar
  document.documentElement.dataset.gate = "closed";

  function buildGate() {
    const overlay = document.createElement("div");
    overlay.id = "password-gate";
    overlay.innerHTML = `
      <div class="gate-card">
        <div class="gate-logo">🔒</div>
        <h1>Dashboard protegido</h1>
        <p>Digite a senha de acesso fornecida pela equipe Somma.</p>
        <form id="gate-form">
          <input type="password" id="gate-input" placeholder="Senha" autocomplete="current-password" autofocus>
          <button type="submit">Entrar</button>
        </form>
        <p class="gate-error" id="gate-error"></p>
        <p class="gate-footer">Esqueceu a senha? Fale com a Somma.</p>
      </div>
    `;
    document.body.appendChild(overlay);

    const form  = document.getElementById("gate-form");
    const input = document.getElementById("gate-input");
    const errEl = document.getElementById("gate-error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errEl.textContent = "";
      const guess = input.value;
      if (!guess) return;

      const buf  = new TextEncoder().encode(guess);
      const hashBuf = await crypto.subtle.digest("SHA-256", buf);
      const hash = Array.from(new Uint8Array(hashBuf))
        .map(x => x.toString(16).padStart(2, "0"))
        .join("");

      if (hash === expectedHash) {
        sessionStorage.setItem(sessionKey, hash);
        document.documentElement.dataset.gate = "open";
        overlay.remove();
        // Dispara evento pra dashboard.js começar a carregar
        document.dispatchEvent(new CustomEvent("gate:unlocked"));
      } else {
        errEl.textContent = "Senha incorreta.";
        input.value = "";
        input.focus();
      }
    });
  }

  if (document.body) {
    buildGate();
  } else {
    document.addEventListener("DOMContentLoaded", buildGate);
  }
})();
