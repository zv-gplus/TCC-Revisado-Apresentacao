// Banco SQLite real em memória; Request/Response reais, infraestrutura simulada.
const assert = require("node:assert/strict");
const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
(async () => {
  const catalog = await import("../src/server/eventos.mjs");
  for (const user of [
    null,
    {},
    { userId: "teste" },
    { userId: "teste", email: null },
    { userId: "teste", email: 123 },
  ])
    assert.equal(catalog.isOwner(user, "owner@example.test"), false);
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(fs.readFileSync("drizzle/0000_abnormal_king_bedlam.sql", "utf8"));
  function prepare(sql) {
    let args = [];
    return {
      bind(...values) {
        args = values;
        return this;
      },
      async run() {
        return sqlite.prepare(sql).run(...args);
      },
      async all() {
        return { results: sqlite.prepare(sql).all(...args) };
      },
      async execute() {
        return /RETURNING|^SELECT/.test(sql) ? this.all() : this.run();
      },
    };
  }
  const env = {
    DB: {
      prepare,
      batch: async (queries) => {
        const rows = [];
        for (const q of queries) rows.push(await q.execute());
        return rows;
      },
    },
    LOG_RATE_SECRET: "test-only-secret",
  };
  function load(path, deps) {
    const exports = {};
    const js = ts.transpileModule(fs.readFileSync(path, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(js, {
      exports,
      require: (name) => {
        if (!(name in deps)) throw Error(name);
        return deps[name];
      },
      crypto: globalThis.crypto,
      TextEncoder,
      TextDecoder,
      Request,
      Response,
      Uint8Array,
      URL,
      Date,
    });
    return exports;
  }
  const logs = load("src/server/logs.ts", { "cloudflare:workers": { env } });
  const route = load("src/app/api/eventos/route.ts", {
    "../../../server/logs": logs,
    "../../../server/eventos.mjs": catalog,
  });
  function req(data, ip = "10.0.0.1", origin = "https://example.test") {
    return new Request("https://example.test/api/eventos", {
      method: "POST",
      headers: { origin, "content-type": "application/json", "cf-connecting-ip": ip },
      body: JSON.stringify(data),
    });
  }
  assert.equal(
    (await route.POST(req({ type: "uso", code: "abrir_site", name: "não guardar" }))).status,
    204,
  );
  assert.equal((await route.POST(req({ type: "uso", code: "<script>" }))).status, 400);
  assert.equal(
    (
      await route.POST(
        req({ type: "erro", code: "erro_javascript" }, "10.0.0.2", "https://other.test"),
      )
    ).status,
    403,
  );
  assert.equal(
    (await route.POST(req({ type: "uso", code: "x".repeat(1024) }, "10.0.0.3"))).status,
    400,
  );
  for (let i = 0; i < 30; i++)
    assert.equal(
      (await route.POST(req({ type: "uso", code: "comparar" }, "10.0.0.4"))).status,
      204,
    );
  assert.equal((await route.POST(req({ type: "uso", code: "comparar" }, "10.0.0.4"))).status, 429);
  assert.equal(catalog.isOwner(null, "owner@test"), false);
  assert.equal(catalog.isOwner({ userId: "1", email: "other@test" }, "owner@test"), false);
  assert.equal(catalog.isOwner({ userId: "1", email: "owner@test" }, "owner@test"), true);
  assert.equal(catalog.isOwner({ userId: "1", email: "owner@test" }, ""), false);
  assert.equal(catalog.classifyPath("/.env"), "caminho_de_varredura");
  assert.equal(catalog.classifyPath("/wp-admin/test"), "caminho_de_varredura");
  assert.equal(catalog.classifyPath("/uma-pagina"), "pagina_inexistente");
  assert.equal(catalog.normalizeEvent({ type: "seguranca", code: "acesso_negado" }), null);
  sqlite
    .prepare("INSERT INTO events(at,type,code,origin) VALUES (?,?,?,?)")
    .run(0, "uso", "abrir_site", "navegador");
  await logs.cleanup(true);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM events WHERE at = 0").get().n, 0);
  for (let i = 0; i < 10005; i++)
    sqlite
      .prepare("INSERT INTO events(at,type,code,origin) VALUES (?,?,?,?)")
      .run(Date.now(), "uso", "abrir_site", "navegador");
  await logs.cleanup(true);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM events").get().n, 10000);
  assert.equal((await logs.listEvents("uso")).rows.length, 100);
  const all = JSON.stringify(sqlite.prepare("SELECT * FROM events").all());
  assert.ok(!all.includes("não guardar"));
  assert.ok(!all.includes("10.0.0."));
  env.DB = undefined;
  assert.equal((await route.POST(req({ type: "uso", code: "abrir_site" }))).status, 503);
  console.log(
    "Logs: coleta, origem, entradas inválidas, limite, autorização, retenção e falha do banco passaram.",
  );
})();
