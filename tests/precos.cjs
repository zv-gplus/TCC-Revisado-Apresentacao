// Executar: node tests/precos.cjs. Não faz requisições às lojas.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { context, evaluate, node, storage } = require("./base.cjs");
const results = [];
function test(name, run) {
  run();
  results.push({ name, status: "passou" });
}

test("Preço da A520 usa a oferta e não o antigo exemplo de R$389", () => {
  evaluate("applyBuild({board:'msi-a520m-a-pro'})");
  assert.equal(node("overview-total").textContent.replace(/\s/g, ""), "R$357,99");
  assert.ok(node("detail-board").innerHTML.includes("Pichau"));
  assert.ok(node("detail-board").innerHTML.includes("26/11/2026"));
  assert.ok(node("detail-board").innerHTML.includes("À vista no Pix"));
  assert.ok(node("build-summary").innerHTML.includes("Ver na loja"));
});
test("Soma em centavos e subtotal indicam o preço que falta", () => {
  evaluate(
    "applyBuild({board:'msi-a520m-a-pro',cpu:'ryzen5-5500',case:'q300l',ram:'ddr5-16gb-5600'})",
  );
  const q = evaluate("getBuildQuote(readBuildParts(),readValidationOptions())");
  assert.equal(q.totalCents, 175598);
  assert.equal(q.priced, 3);
  assert.equal(q.missing, 1);
  assert.ok(node("overview-price-label").textContent.includes("Subtotal"));
  assert.ok(node("price-coverage").textContent.includes("3 de 4"));
  assert.ok(node("build-summary").innerHTML.includes("Sem valor confiável"));
  assert.equal(node("mobile-total").textContent, node("overview-total").textContent);
});
test("Somente produtos sem preço não são apresentados como gratuitos", () => {
  evaluate("applyBuild({ram:'ddr5-16gb-5600',gpu:'rtx4090'})");
  assert.equal(node("overview-total").textContent, "—");
  assert.ok(node("detail-gpu").innerHTML.includes("Escolha o modelo físico"));
  assert.ok(!node("build-summary").innerHTML.includes("R$ 0,00"));
});
test("Orçamento com preços faltando não afirma que sobra dinheiro", () => {
  node("budget-limit").value = "999999";
  evaluate("updateOverview(readBuildParts())");
  assert.ok(node("budget-status").textContent.includes("preços faltando"));
  assert.ok(!node("budget-status").textContent.includes("Restam"));
  evaluate("applyBuild({cpu:'ryzen5-5500',ram:'ddr5-16gb-5600'})");
  node("budget-limit").value = "100";
  evaluate("updateOverview(readBuildParts())");
  assert.ok(node("budget-status").textContent.includes("subtotal já está acima"));
});
test("Quando todas as peças selecionadas têm preço, mostra total consultado", () => {
  evaluate("applyBuild({cpu:'ryzen5-5500',board:'msi-a520m-a-pro'})");
  node("budget-limit").value = "1000";
  evaluate("updateOverview(readBuildParts())");
  assert.equal(node("overview-total").textContent.replace(/\s/g, ""), "R$857,98");
  assert.equal(node("overview-price-label").textContent, "Total com ofertas atuais");
  assert.ok(node("budget-status").textContent.includes("Restam"));
});
test("Referência da MSI RTX 4060 mostra modelo, fonte e valor fora do total ativo", () => {
  evaluate("applyBuild({gpu:'rtx4060'},{gpuVariant:'msi-4060-ventus-oc'})");
  assert.match(node("detail-gpu").innerHTML, /TerabyteShop/);
  assert.match(node("detail-gpu").innerHTML, /Referência histórica — disponibilidade não confirmada/);
  assert.match(node("detail-gpu").innerHTML, /912-V516-012/);
  assert.match(node("overview-total").textContent, /2\.274,59/);
  assert.match(node("build-offer-subtotal").textContent, /nenhuma oferta/);
  assert.equal(evaluate("getBuildQuote(readBuildParts(),readValidationOptions()).priced"), 0);
  assert.ok(!node("detail-gpu").innerHTML.includes("3.999,88"));
});
test("Orçamento monetário usa centavos e rejeita formato inválido", () => {
  evaluate("applyBuild({cpu:'ryzen5-5500'})");
  for (const invalid of ["499.994", "-1", "0", "1000000.01", "1e3", "texto"]) {
    node("budget-limit").value = invalid;
    evaluate("updateOverview(readBuildParts())");
    assert.equal(node("budget-limit").attributes["aria-invalid"], "true", invalid);
    assert.match(node("budget-status").textContent, /até duas casas decimais/);
    assert.equal(evaluate("getBudget()"), "");
    assert.equal(evaluate(`normalizeSavedBuild({version:1,parts:{},budget:${JSON.stringify(invalid)}}).budget`), "");
    assert.doesNotMatch(evaluate("exportBuildText(readBuildParts())"), /Orçamento informado/);
  }
  node("budget-limit").value = "";
  evaluate("updateOverview(readBuildParts())");
  assert.equal(node("budget-status").textContent, "");
  node("budget-limit").value = "500.00";
  evaluate("updateOverview(readBuildParts())");
  assert.match(node("budget-status").textContent, /0,01/);
  assert.match(evaluate("exportBuildText(readBuildParts())"), /Orçamento informado: R\$\s*500,00/);
  assert.equal(evaluate("normalizeSavedBuild({version:1,parts:{},budget:500.01}).budget"), 500.01);
});
test("Resumo exportado distingue saldo, excesso e subtotal incompleto", () => {
  node("budget-limit").value = "500.00";
  evaluate("applyBuild({cpu:'ryzen5-5500',ram:'ddr5-16gb-5600'})");
  const partial = evaluate("exportBuildText(readBuildParts())");
  assert.match(partial, /Subtotal/);
  assert.match(partial, /1 sem oferta atual/);
  assert.doesNotMatch(partial, /Restam/);
  node("budget-limit").value = "499.98";
  assert.match(evaluate("exportBuildText(readBuildParts())"), /subtotal já está acima.*0,01/);
  node("budget-limit").value = "";
  assert.match(evaluate("exportBuildText(readBuildParts())"), /subtotal não representa o custo completo/);
});
test("GPU só usa oferta da variante exata e troca recalcula o resumo (fixture)", () => {
  evaluate(
    "globalThis.originalOffer=PRODUCT_OFFERS['gpu:asus-7600-dual-oc'];PRODUCT_OFFERS['gpu:asus-7600-dual-oc']={...originalOffer,status:'quoted',payment:'À vista no Pix',priceCents:199999}",
  );
  try {
    evaluate("applyBuild({gpu:'rx7600'},{gpuVariant:'asus-7600-dual-oc'})");
    assert.equal(
      evaluate("getBuildQuote(readBuildParts(),readValidationOptions()).totalCents"),
      199999,
    );
    node("gpu-variant").value = "sapphire-7600-pulse";
    node("gpu-variant").handlers.change();
    assert.match(node("overview-total").textContent, /1\.899,99/);
    assert.ok(!node("build-summary").innerHTML.includes("1999"));
    assert.equal(
      evaluate("getPartOffer('gpu',getItem('gpu','rtx4060'),{gpuVariant:'asus-7600-dual-oc'})"),
      null,
    );
  } finally {
    evaluate(
      "PRODUCT_OFFERS['gpu:asus-7600-dual-oc']=originalOffer;delete globalThis.originalOffer",
    );
  }
});
test("Links perigosos, de busca ou de outro domínio não são exibidos", () => {
  for (const url of [
    "javascript:alert(1)",
    "http://www.pichau.com.br/produto-real",
    "https://www.pichau.com.br.evil.test/produto-real",
    "https://evil.test/produto-real",
    "https://user:pass@www.pichau.com.br/produto-real",
    "https://www.pichau.com.br/busca?q=cpu",
    "https://www.pichau.com.br/produto-real?redirect=evil",
    "https://www.pichau.com.br/",
  ]) {
    assert.equal(
      evaluate(`validOffer({...PRODUCT_OFFERS['cpu:ryzen5-5500'],url:${JSON.stringify(url)}})`),
      false,
      url,
    );
  }
});
test("Preço negativo, texto, infinito, zero, sem data ou com data impossível é rejeitado", () => {
  for (const patch of [
    "priceCents:-1",
    "priceCents:'55999'",
    "priceCents:Infinity",
    "priceCents:0",
    "priceCents:1.5",
    "checkedAt:''",
    "checkedAt:'2026-02-30'",
    "checkedAt:'2099-01-01'",
    "store:'Loja desconhecida'",
  ]) {
    assert.equal(
      evaluate(`validOffer({...PRODUCT_OFFERS['cpu:ryzen5-5500'],${patch}})`),
      false,
      patch,
    );
  }
});
test("Salvar/restaurar mantém os IDs e ignora preço forjado no armazenamento", () => {
  context.localStorage.setItem = (key, value) => storage.set(key, value);
  evaluate("applyBuild({board:'msi-a520m-a-pro'})");
  node("save-build").handlers.click();
  const saved = JSON.parse(storage.get("ntj-builder-v1"));
  saved.priceCents = 1;
  saved.parts.price = 1;
  saved.options.offerUrl = "https://evil.test";
  storage.set("ntj-builder-v1", JSON.stringify(saved));
  evaluate("applyBuild({});initBuilderTools()");
  assert.equal(node("overview-total").textContent.replace(/\s/g, ""), "R$357,99");
  assert.ok(!node("build-summary").innerHTML.includes("evil.test"));
});
test("Exportação informa valor, loja, SKU, condição, data, link e preços faltantes", () => {
  evaluate("applyBuild({cpu:'ryzen5-5500',ram:'ddr5-16gb-5600'})");
  const output = evaluate("exportBuildText(readBuildParts())");
  for (const word of [
    "499,99",
    "Pichau",
    "100-100000457BOX",
    "À vista no Pix",
    "26/11/2026",
    "https://www.pichau.com.br/",
    "Subtotal",
    "sem oferta atual",
    "Frete não incluído",
  ])
    assert.ok(output.includes(word), word);
  assert.ok(!output.includes("Total ilustrativo"));
});
test("Comparador não inventa diferença quando falta um preço", () => {
  evaluate(
    "currentCompareType='cpu';document.getElementById('compare-left').value='ryzen5-5500';document.getElementById('compare-right').value='i5-13600k';runComparison()",
  );
  assert.ok(node("compare-result-area").innerHTML.includes("Não há duas ofertas confirmadas"));
  evaluate("document.getElementById('compare-right').value='ryzen5-7600x';runComparison()");
  assert.ok(node("compare-result-area").innerHTML.includes("590,00"));
});
test("Todas as ofertas são válidas, apontam para item existente e têm vendedor explícito", () => {
  evaluate(`for(const [key,offer]of Object.entries(PRODUCT_OFFERS)){
  if(!validOffer(offer))throw Error('Oferta inválida: '+key);
  const [type,id]=key.split(':');
  if(type==='gpu'?!GPU_VARIANTS.some(x=>x.id===id):!getItem(type,id))throw Error('Peça ausente: '+key);
  if(offer.status==='unavailable'&&offer.priceCents!==null)throw Error('Esgotado tem preço ativo');
 }`);
});
test("Comparador separa preços de duas variantes físicas do mesmo chip", () => {
  const original = evaluate("PRODUCT_OFFERS['gpu:asus-7600-dual-oc']");
  const other = evaluate("PRODUCT_OFFERS['gpu:sapphire-7600-pulse']");
  try {
    evaluate(`Object.assign(PRODUCT_OFFERS, {
      "gpu:asus-7600-dual-oc": {...PRODUCT_OFFERS["gpu:asus-7600-dual-oc"], status:"quoted", priceCents:199999, payment:"À vista no Pix"},
      "gpu:sapphire-7600-pulse": {...PRODUCT_OFFERS["gpu:asus-7600-dual-oc"], product:"Sapphire Pulse RX 7600", sku:"TESTE-PULSE", priceCents:189999, status:"quoted", payment:"À vista no Pix"},
    });
    currentCompareType = "gpu";
    populateCompareSelects();`);
    const left = node("compare-left");
    const right = node("compare-right");
    assert.match(left.innerHTML, /Modelos físicos/);
    left.value = "asus-7600-dual-oc";
    right.value = "sapphire-7600-pulse";
    evaluate("runComparison()");
    const result = node("compare-result-area");
    assert.match(result.innerHTML, /TESTE-PULSE/);
    assert.match(result.innerHTML, /Diferença entre os preços consultados: R\$\s*100,00/);
    left.value = "rx7600";
    evaluate("runComparison()");
    assert.match(result.innerHTML, /escolha os modelos físicos/);
    assert.doesNotMatch(result.innerHTML, /1\.999,99/);
  } finally {
    evaluate(`PRODUCT_OFFERS["gpu:asus-7600-dual-oc"] = ${JSON.stringify(original)}`);
    if (other) evaluate(`PRODUCT_OFFERS["gpu:sapphire-7600-pulse"] = ${JSON.stringify(other)}`);
    else evaluate('delete PRODUCT_OFFERS["gpu:sapphire-7600-pulse"]');
  }
});
test("Ofertas atuais, referência histórica e estimativa ficam separadas do orçamento", () => {
  const key = "ram:ddr5-16gb-5600";
  evaluate(`PRODUCT_PRICE_REFERENCES["${key}"] = {
    kind: "estimate", sku: "KIT-TESTE", priceCents: 20000,
    checkedAt: "2026-11-26", note: "Estimativa de teste com duas fontes do mesmo kit.",
    sources: [PRODUCT_OFFERS["board:msi-a520m-a-pro"], PRODUCT_OFFERS["cpu:ryzen5-5500"]]
  }`);
  try {
    evaluate("applyBuild({cpu:'ryzen5-5500',ssd:'kingston-nv2-500gb',ram:'ddr5-16gb-5600'})");
    node("budget-limit").value = "600";
    evaluate("updateOverview(readBuildParts())");
    const quote = evaluate("getBuildQuote(readBuildParts(),readValidationOptions())");
    assert.equal(quote.totalCents, 49999);
    assert.equal(quote.referenceCents, 49741);
    assert.equal(quote.referenced, 2);
    assert.match(node("overview-total").textContent, /997,40/);
    assert.match(node("overview-price-label").textContent, /Estimativa de custo/);
    assert.equal(node("mobile-total").textContent, node("overview-total").textContent);
    assert.match(node("build-summary").innerHTML, /997,40/);
    assert.match(node("build-offer-subtotal").textContent, /499,99/);
    assert.doesNotMatch(evaluate("partPriceText('ssd', getItem('ssd','kingston-nv2-500gb'))"), /histórico/);
    assert.match(node("detail-ram").innerHTML, /Estimativa de referência/);
    assert.doesNotMatch(node("budget-status").textContent, /acima|Restam/);
    assert.match(evaluate("exportBuildText(readBuildParts())"), /Estimativa de custo da montagem.*997,40/);
    assert.equal(evaluate(`validPriceReference({...PRODUCT_PRICE_REFERENCES["${key}"], sources:[{store:"Pichau",url:"javascript:alert(1)"}]})`), false);
  } finally {
    evaluate(`delete PRODUCT_PRICE_REFERENCES["${key}"]`);
  }
});
test("Referências têm URL segura e cada entrada comercial tem um estado verificável", () => {
  evaluate(`for(const [key,reference] of Object.entries(PRODUCT_PRICE_REFERENCES)) {
    if (!validPriceReference(reference)) throw Error("Referência inválida: " + key);
    if (PRODUCT_OFFERS[key]?.status === "quoted") throw Error("Oferta e referência simultâneas: " + key);
    const [type,id] = key.split(":");
    if (type === "gpu" ? !GPU_VARIANTS.some(v => v.id === id) : !getItem(type,id))
      throw Error("Referência sem item: " + key);
  }
  const keys = [
    ...Object.entries(DB).filter(([type]) => type !== "gpu").flatMap(([type, items]) => items.map(({id}) => type + ":" + id)),
    ...GPU_VARIANTS.map(({id}) => "gpu:" + id)
  ];
  for (const key of keys) {
    const states = [PRODUCT_OFFERS[key]?.status === "quoted", Boolean(PRODUCT_PRICE_REFERENCES[key]), Boolean(PRODUCT_PRICE_GAPS[key])];
    if (states.filter(Boolean).length !== 1) throw Error("Estado comercial ausente ou duplicado: " + key);
  }
  if (validReferenceLink({store:"PromoTop",url:"https://promotop.net.evil.test/placa-de-video-produto-teste"}))
    throw Error("Fonte falsa aceita");`);
});
fs.writeFileSync(
  "resultado-precos.json",
  JSON.stringify(
    {
      date: new Date().toISOString().slice(0, 10),
      tests: results,
      offers: evaluate("Object.values(PRODUCT_OFFERS).filter(x=>x.status==='quoted').length"),
      unavailable: evaluate(
        "Object.values(PRODUCT_OFFERS).filter(x=>x.status==='unavailable').length",
      ),
    },
    null,
    2,
  ),
);
console.log(
  `${results.length} testes de ofertas, soma, modelo exato, entradas inválidas e exportação passaram.`,
);
