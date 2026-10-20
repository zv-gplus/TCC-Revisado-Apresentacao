// Telemetria auxiliar: jamais interfere no funcionamento do montador.
(function () {
  if (!/^https?:$/.test(location.protocol) || navigator.doNotTrack === "1") return;
  let sent = 0;
  const lastSent = new Map();
  function send(type, code) {
    if (document.visibilityState === "hidden" || sent >= 60) return;
    const now = Date.now();
    if (now - (lastSent.get(code) || 0) < 5000) return;
    lastSent.set(code, now);
    sent++;
    fetch("/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, code }),
      credentials: "omit",
      keepalive: true,
    }).catch(() => {});
  }
  send("uso", "abrir_site");
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const codes = {
      "tab-builder": "abrir_montador",
      "save-build": "salvar_montagem",
      "share-build": "compartilhar",
    };
    if (codes[button.id]) send("uso", codes[button.id]);
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches('select[id^="build-"]')) send("uso", "trocar_peca");
    if (event.target.matches("#compare-left, #compare-right")) send("uso", "comparar");
  });
  window.addEventListener(
    "error",
    (event) => send("erro", event instanceof ErrorEvent ? "erro_javascript" : "falha_recurso"),
    true,
  );
  window.addEventListener("unhandledrejection", () => send("erro", "promessa_rejeitada"));
})();
