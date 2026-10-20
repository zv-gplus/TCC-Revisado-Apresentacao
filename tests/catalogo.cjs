// Execute: node tests/catalogo.cjs. Testa catálogo e seleções usando o DOM simulado.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { context, evaluate, node, storage } = require("./base.cjs");
const results = [];
function test(name, run) {
  run();
  results.push({ name, status: "passou" });
}

test("Todas as placas-mãe oferecem BIOS documentadas na interface", () => {
  for (const id of evaluate("DB.board.map(item=>item.id)")) {
    evaluate(`applyBuild({board:${JSON.stringify(id)}})`);
    assert.ok(node("bios-version").options.length > 1, id);
    assert.equal(node("bios-version").value, "");
    assert.equal(
      new Set(node("bios-version").options.map((item) => item.value)).size,
      node("bios-version").options.length,
    );
  }
});
test("Cada chip de GPU oferece modelo exato, sem escolher automaticamente", () => {
  for (const id of evaluate("DB.gpu.map(item=>item.id)")) {
    evaluate(`applyBuild({gpu:${JSON.stringify(id)}})`);
    assert.ok(
      node("gpu-variant").options.length >= 3,
      id + ": deve oferecer dois modelos e a opção desconhecida",
    );
    assert.equal(node("gpu-variant").value, "");
    for (const option of node("gpu-variant").options.slice(1)) {
      assert.equal(
        evaluate(`GPU_VARIANTS.find(item=>item.id===${JSON.stringify(option.value)}).gpuId`),
        id,
      );
    }
  }
});
test("Trocar a GPU pelo controle atualiza a lista e limpa o modelo anterior", () => {
  for (const id of evaluate("DB.gpu.map(item=>item.id)")) {
    node("build-gpu").value = id;
    node("build-gpu").handlers.change();
    assert.equal(node("gpu-variant").value, "");
    for (const option of node("gpu-variant").options.slice(1)) {
      assert.equal(
        evaluate(`GPU_VARIANTS.find(item=>item.id===${JSON.stringify(option.value)}).gpuId`),
        id,
      );
    }
    assert.ok(
      node("gpu-model-help").textContent.includes(
        evaluate(`getItem('gpu',${JSON.stringify(id)}).name`),
      ),
    );
    node("gpu-variant").value = node("gpu-variant").options[1].value;
    node("gpu-variant").handlers.change();
  }
});
test("Modelos da mesma GPU têm medidas próprias", () => {
  evaluate("applyBuild({gpu:'rx7900xtx',case:'q300l'},{gpuVariant:'asus-7900xtx-tuf-oc'})");
  assert.ok(
    evaluate(
      "getExtendedChecks(readBuildParts(),readValidationOptions()).find(x=>x.id==='case-gpu').message",
    ).includes("352.9 mm"),
  );
  node("gpu-variant").value = "sapphire-7900xtx-pulse";
  node("gpu-variant").handlers.change();
  assert.ok(
    evaluate(
      "getExtendedChecks(readBuildParts(),readValidationOptions()).find(x=>x.id==='case-gpu').message",
    ).includes("313 mm"),
  );
});
test("MSI B650 tem mínimo 7D75v10 para os três Ryzen 7000 cadastrados", () => {
  for (const id of ["ryzen9-7950x", "ryzen7-7700x", "ryzen5-7600x"]) {
    assert.equal(
      evaluate(
        `getBiosCheck(getItem('board','msi-b650-tomahawk'),getItem('cpu','${id}'),'7D75v10').state`,
      ),
      "ok",
    );
    assert.equal(
      evaluate(
        `getBiosCheck(getItem('board','msi-b650-tomahawk'),getItem('cpu','${id}'),'').state`,
      ),
      "pending",
    );
  }
});
test("MSI A520 bloqueia 7C96v18 para Ryzen 5500 e aceita 7C96v19", () => {
  for (const [version, expected] of [
    ["7C96v18", "blocked"],
    ["7C96v19", "ok"],
    ["7C96v1L9", "ok"],
    ["9999", "pending"],
  ]) {
    assert.equal(
      evaluate(
        `getBiosCheck(getItem('board','msi-a520m-a-pro'),getItem('cpu','ryzen5-5500'),'${version}').state`,
      ),
      expected,
    );
  }
});
test("Ordem da BIOS segue data oficial, inclusive 1M3 antes de 1M", () => {
  const sources = require("../docs/fontes-bios-msi.json");
  for (const [id, board] of Object.entries(sources.boards)) {
    assert.equal(
      JSON.stringify(evaluate(`BIOS_RULES['${id}'].versions`)),
      JSON.stringify(board.versions.map((item) => item.version)),
    );
    assert.ok(
      board.versions.every((item, i, items) => !i || item.released >= items[i - 1].released),
    );
    assert.ok(board.versions.every((item) => !item.version.toLowerCase().includes("beta")));
  }
  assert.ok(
    evaluate(
      "BIOS_RULES['msi-b650-tomahawk'].versions.indexOf('7D75v1M3') < BIOS_RULES['msi-b650-tomahawk'].versions.indexOf('7D75v1M')",
    ),
  );
});
test("RX 7700 XT do exemplo tem medidas e dois conectores de 8 pinos", () => {
  evaluate(
    "applyBuild({gpu:'rx7700xt',case:'ch370',psu:'msi-a550bn-550w'},{gpuVariant:'sapphire-7700xt-pulse',psuConfirmed:true})",
  );
  assert.equal(node("gpu-variant").value, "sapphire-7700xt-pulse");
  const checks = evaluate("getExtendedChecks(readBuildParts(),readValidationOptions())");
  assert.equal(checks.find((item) => item.id === "case-gpu").state, "ok");
  assert.ok(checks.find((item) => item.id === "case-gpu").message.includes("280 mm"));
  assert.ok(checks.find((item) => item.id === "power-gpu").message.includes("2 PCIe"));
  assert.equal(checks.find((item) => item.id === "gpu-psu-guidance").state, "pending");
});
test("RX 7900 XTX Pulse exige três plugs, A550BN tem dois", () => {
  assert.equal(
    evaluate(
      "getExtendedChecks({gpu:getItem('gpu','rx7900xtx'),psu:getItem('psu','msi-a550bn-550w')},{gpuVariant:'sapphire-7900xtx-pulse',psuConfirmed:true}).find(x=>x.id==='power-gpu').state",
    ),
    "blocked",
  );
});
test("Dados ausentes de cabo ou recomendação não viram aprovação ou undefined", () => {
  for (const [chip, variant, check] of [
    ["rtx4070ti", "msi-4070ti-ventus-oc", "power-gpu"],
    ["rtx4070tisuper", "msi-4070tisuper-ventus-oc", "power-gpu"],
    ["rtx3060-12gb", "msi-3060-12gb-ventus-oc", "gpu-psu-guidance"],
  ]) {
    const result = evaluate(
      `getExtendedChecks({gpu:getItem('gpu','${chip}'),psu:getItem('psu','msi-a750gl-750w')},{gpuVariant:'${variant}',psuConfirmed:true}).find(x=>x.id==='${check}')`,
    );
    assert.equal(result.state, "pending");
    assert.ok(!/undefined|NaN/.test(result.message));
  }
});
test("Novos gabinetes e coolers aparecem e preservam montagem salva", () => {
  context.localStorage.setItem = (key, value) => storage.set(key, value);
  for (const id of ["ch370", "cc560", "cc560v2", "ch560"])
    assert.ok(node("build-case").options.some((x) => x.value === id));
  for (const id of ["ag400", "ag500", "ag620", "ak500"])
    assert.ok(node("build-cooler").options.some((x) => x.value === id));
  evaluate(
    "applyBuild({...EXAMPLE_BUILDS.am5,case:'ch560',cooler:'ag620',gpu:'rx7700xt'},{biosVersion:'7D75v1L',gpuVariant:'sapphire-7700xt-pulse'})",
  );
  node("save-build").handlers.click();
  evaluate("applyBuild({});initBuilderTools()");
  assert.equal(node("build-case").value, "ch560");
  assert.equal(node("build-cooler").value, "ag620");
  assert.equal(node("bios-version").value, "7D75v1L");
  assert.equal(node("gpu-variant").value, "sapphire-7700xt-pulse");
});
test("Novas medidas afetam a compatibilidade e preservam as folgas pendentes", () => {
  const checks = evaluate(
    "getExtendedChecks({board:getItem('board','msi-b650-tomahawk'),case:getItem('case','ch370'),cooler:getItem('cooler','ag620')})",
  );
  assert.equal(checks.find((x) => x.id === "case-board").state, "blocked");
  assert.equal(checks.find((x) => x.id === "case-cooler").state, "ok");
  assert.equal(checks.find((x) => x.id === "assembly-details").state, "pending");
});
test("Todas as variantes têm IDs únicos, chip existente, medidas e fonte oficial", () => {
  evaluate(`(() => {
    const ids=new Set();
    for(const item of GPU_VARIANTS){
      if(ids.has(item.id) || !getItem('gpu',item.gpuId))throw Error('ID inválido: '+item.id);
      ids.add(item.id);
      for(const field of ['length','width','thickness']) if(!Number.isFinite(item[field])||item[field]<=0)throw Error('Medida inválida');
      if(!OFFICIAL_SOURCES[item.source]?.url.startsWith('https://'))throw Error('Fonte ausente');
    }
  })()`);
});
test("Cada nova variante produz verificações sem dados inválidos", () => {
  evaluate(`for(const variant of GPU_VARIANTS)for(const chassis of DB.case)for(const psu of DB.psu){
    const checks=getExtendedChecks({gpu:getItem('gpu',variant.gpuId),case:chassis,psu},{gpuVariant:variant.id,psuConfirmed:true});
    for(const check of checks){
      if(!['ok','blocked','pending'].includes(check.state)||/undefined|NaN/.test(check.message))throw Error('Resultado inválido '+variant.id);
      for(const source of check.sources)if(!OFFICIAL_SOURCES[source]?.url.startsWith('https://'))throw Error('Fonte inválida');
    }
  }`);
});
fs.writeFileSync(
  "resultado-catalogo.json",
  JSON.stringify(
    {
      date: new Date().toISOString().slice(0, 10),
      tests: results,
      counts: evaluate(
        "({boards:DB.board.length,gpuChips:DB.gpu.length,gpuModels:GPU_VARIANTS.length,cases:DB.case.length,coolers:DB.cooler.length,biosVersions:Object.values(BIOS_RULES).reduce((sum,item)=>sum+item.versions.length,0)})",
      ),
    },
    null,
    2,
  ),
);
console.log(`${results.length} testes do catálogo passaram.`);
