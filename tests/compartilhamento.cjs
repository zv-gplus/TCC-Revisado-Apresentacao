const assert = require("node:assert/strict");
const { evaluate, node } = require("./base.cjs");
evaluate("applyBuild(EXAMPLE_BUILDS.am4)");
const url = new URL(evaluate("createBuildLink()"));
assert.equal(
  evaluate(`readSharedBuild(${JSON.stringify(url.hash)}).parts.cpu`),
  node("build-cpu").value,
);
assert.equal(evaluate(`readSharedBuild(${JSON.stringify(url.hash)}).options.psuConfirmed`), false);
assert.equal(
  evaluate("readSharedBuild('#montagem=cpu=%3Cscript%3E&budget=Infinity').parts.cpu"),
  "",
);
assert.equal(evaluate("readSharedBuild('#montagem=cpu=x&budget=-10').budget"), "");
assert.equal(evaluate("readSharedBuild('#outro=cpu=x')"), null);
assert.equal(evaluate("readSharedBuild('#montagem=' + 'x'.repeat(2001))"), null);
evaluate("localStorage.removeItem = () => {throw Error('bloqueado')}");
node("clear-build").handlers.click();
assert.ok(node("save-status").textContent.includes("não permitiu apagar"));
console.log("Compartilhamento, entradas inválidas e falha ao limpar: passaram.");
// Navegação entre links da mesma página deve aplicar a nova montagem.
const { windowHandlers } = require("./base.cjs");
evaluate("location.hash='#montagem=cpu=ryzen5-5500&budget=3500'");
windowHandlers.hashchange();
assert.equal(node("build-cpu").value, "ryzen5-5500");
assert.equal(node("budget-limit").value, 3500);
evaluate("location.hash='#montagem=cpu=ryzen5-7600x'");
windowHandlers.hashchange();
assert.equal(node("build-cpu").value, "ryzen5-7600x");
evaluate("location.hash='#main-content'");
windowHandlers.hashchange();
assert.equal(node("build-cpu").value, "ryzen5-7600x");
evaluate("location.href='https://ntj.test/?parametro=nao-compartilhar'");
assert.equal(new URL(evaluate("createBuildLink()")).search, "");
console.log(
  "Links: mudar o fragmento atualiza a montagem e parâmetros extras não são encaminhados.",
);
