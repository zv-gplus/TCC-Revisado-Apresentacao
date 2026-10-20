// O link contém somente IDs conhecidos. Não transfere confirmações físicas.
function createBuildLink() {
  const params = new URLSearchParams();
  for (const type of BUILD_TYPES) {
    const id = document.getElementById("build-" + type).value;
    if (getItem(type, id)) params.set(type, id);
  }
  if (getBudget()) params.set("budget", getBudget());
  const url = new URL(location.href);
  url.search = ""; // Não encaminha parâmetros extras do endereço atual.
  url.hash = "montagem=" + params.toString();
  return url.href;
}

function readSharedBuild(hash) {
  if (!hash.startsWith("#montagem=") || hash.length > 2000) return null;
  const params = new URLSearchParams(hash.slice(10));
  return normalizeSavedBuild({
    version: 1,
    parts: Object.fromEntries(BUILD_TYPES.map((type) => [type, params.get(type)])),
    budget: params.get("budget"),
  });
}

function initSharing() {
  const dialog = document.getElementById("share-dialog");
  document.getElementById("share-build").addEventListener("click", () => {
    document.getElementById("share-url").value = createBuildLink();
    document.getElementById("share-status").textContent = "";
    dialog.showModal();
  });
  document.getElementById("close-share").addEventListener("click", () => dialog.close());
  document.getElementById("copy-build-link").addEventListener("click", async () => {
    const input = document.getElementById("share-url");
    try {
      await navigator.clipboard.writeText(input.value);
      document.getElementById("share-status").textContent = "Link copiado.";
    } catch {
      input.select();
      document.getElementById("share-status").textContent = "Selecione e copie o link acima.";
    }
  });
  document.getElementById("compatibility-status").addEventListener("click", (event) => {
    if (event.target.closest('a[href="#validation-panel"]'))
      document.getElementById("validation-panel").open = true;
  });
  function loadSharedBuild() {
    const shared = readSharedBuild(location.hash);
    if (!shared) return;
    document.getElementById("budget-limit").value = shared.budget;
    applyBuild(shared.parts);
    switchTab("builder", document.getElementById("tab-builder"));
    document.getElementById("save-status").textContent =
      "Montagem recebida pelo link. Confira as pendências antes de salvar.";
  }
  window.addEventListener("hashchange", loadSharedBuild);
  loadSharedBuild();
}
