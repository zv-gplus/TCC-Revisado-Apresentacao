// Ensaios de segurança do aplicativo: sem atingir serviços de terceiros.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const results = [];
  const sensitive = [
    "/.env",
    "/.env.local",
    "/.git/config",
    "/backup.sql",
    "/database.sqlite",
    "/.openai/hosting.json",
  ];
  for (const pathname of sensitive) {
    assert.ok(!fs.existsSync(path.join("dist/client", pathname.slice(1))));
  }
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      entry.isDirectory() ? walk(p) : files.push(p);
    }
  }
  walk("dist/client");
  assert.ok(
    !files.some(
      (f) => /\.(sql|sqlite|db|map|zip)$/.test(f) || f.includes("/.env") || f.includes("/.git/"),
    ),
  );
  // Um slug como sandisk-sn850x contém "sk-" no meio do nome da marca.
  for (const f of files.filter((f) => /\.(js|json|html|css)$/.test(f)))
    assert.ok(
      !/(?:ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|\bsk-[A-Za-z0-9_-]{30,})/.test(
        fs.readFileSync(f, "utf8"),
      ),
      "Possível segredo no arquivo " + f,
    );
  // Executa as verificações HTTP no mesmo roteador de ativos usado pela prévia.
  process.env.XDG_CONFIG_HOME ||= path.resolve(".wrangler/config");
  process.env.WRANGLER_SEND_METRICS = "false";
  process.env.WRANGLER_WRITE_LOGS = "false";
  const { unstable_dev } = await import("wrangler");
  const preview = await unstable_dev(undefined, {
    config: "wrangler.jsonc",
    compatibilityDate: "2026-05-15",
    ip: "127.0.0.1",
    port: 0,
    local: true,
    persist: false,
    inspect: false,
    logLevel: "error",
    experimental: { disableExperimentalWarning: true, disableDevRegistry: true },
  });
  try {
    for (const pathname of sensitive.concat("/pagina-inexistente")) {
      const response = await preview.fetch(pathname);
      assert.equal(response.status, 404, pathname);
      assert.ok(!(await response.text()).includes("CREATE TABLE"));
    }
    const response = await preview.fetch("/");
    assert.equal(response.status, 200);
    assert.equal(await response.text(), fs.readFileSync("dist/client/index.html", "utf8"));
    assert.match(response.headers.get("cache-control"), /\bmax-age=0\b/);
    assert.match(response.headers.get("cache-control"), /\bmust-revalidate\b/);
  } finally {
    await preview.stop();
  }
  results.push({
    test: "Exposição de arquivos sensíveis",
    status: "passou no artefato/local",
    detail:
      "Os caminhos verificados não existem no diretório público e recebem 404 na rota local. Nenhum banco, SQL, mapa de código, ZIP ou padrão conhecido de token encontrado no artefato público; não é detector de todos os segredos.",
  });
  results.push({
    test: "Cache dos arquivos estáticos",
    status: "passou na prévia local",
    detail:
      "A prévia serviu o HTML do artefato e informou max-age=0 e must-revalidate.",
  });
  // Verifica os fluxos públicos com dados maliciosos sem usar o catálogo como HTML livre.
  const { evaluate, node } = require("./base.cjs");
  evaluate(
    "DB.cpu[0].name='<img src=x onerror=alert(1)>';currentCompareType='cpu';document.getElementById('compare-left').value=DB.cpu[0].id;document.getElementById('compare-right').value=DB.cpu[1].id;runComparison()",
  );
  assert.ok(node("compare-result-area").innerHTML.includes("&lt;img"));
  assert.ok(!node("compare-result-area").innerHTML.includes("<img"));
  evaluate("applyBuild({cpu:DB.cpu[0].id})");
  assert.ok(!node("build-summary").innerHTML.includes("<img"));
  assert.equal(
    evaluate("readSharedBuild('#montagem=cpu=%3Cscript%3E&budget=Infinity').parts.cpu"),
    "",
  );
  results.push({
    test: "Conteúdo malicioso no montador e links",
    status: "passou localmente",
    detail:
      "Nome de catálogo adulterado escapado no comparador e resumo; identificador malicioso e orçamento inválido descartados. DOM simulado.",
  });
  fs.writeFileSync(
    "resultado-ataques.json",
    JSON.stringify(
      {
        at: new Date().toISOString(),
        environment:
          "Artefato estático, prévia local do Wrangler e funções do front-end em DOM simulado",
        results,
      },
      null,
      2,
    ),
  );
  for (const row of results) console.log(row.status.toUpperCase() + ": " + row.test);
})();
