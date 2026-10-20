const assert = require('node:assert/strict');
const {evaluate, node} = require('../testes.cjs');
let checked = 0;
const items = evaluate('JSON.stringify(Object.entries(DB).flatMap(([type,items]) => items.map(item => ({type,id:item.id}))))');
for (const {type,id} of JSON.parse(items)) {
  const source = evaluate('getProductSource('+JSON.stringify(type)+', getItem('+JSON.stringify(type)+','+JSON.stringify(id)+'))');
  assert.ok(source?.url, type+':'+id+' precisa de referência');
  checked++;
}
const variants = JSON.parse(evaluate('JSON.stringify(GPU_VARIANTS.map(v=>({id:v.id,gpuId:v.gpuId,source:v.source})))'));
for (const v of variants) {
  const source = evaluate('getProductSource("gpu", getItem("gpu",'+JSON.stringify(v.gpuId)+'), {gpuVariant:'+JSON.stringify(v.id)+'})');
  assert.equal(source.url, evaluate('OFFICIAL_SOURCES['+JSON.stringify(v.source)+'].url'));
  checked++;
}
assert.ok(evaluate('getProductSource("ram", DB.ram[0]).note').includes('ilustrativa'));
assert.ok(evaluate('getProductSource("gpu", getItem("gpu","rtx4060"), {gpuVariant:"sapphire-7600-pulse"}).note').includes('chip/família'));
for (const url of ['javascript:alert(1)','http://www.amd.com/test','https://www.amd.com.evil.test','https://user:pass@www.amd.com/','https://www.amd.com:8443/']) {
  assert.equal(evaluate('validSource({title:"teste",url:'+JSON.stringify(url)+'})'),false);
}
assert.equal(evaluate('validSource(null)'), false);
evaluate('applyBuild({cpu:"ryzen5-5500",gpu:"rtx4060"});');
assert.ok(node('detail-cpu').innerHTML.includes('Referência do produto'));
assert.ok(node('build-summary').innerHTML.includes('Referência do produto'));
assert.ok(evaluate('exportBuildText(readBuildParts())').includes('Referência:'));
assert.equal(evaluate('getItem("ssd","kingston-sata-1tb").capacity'),'960GB');
console.log(checked+' produtos/variantes com referência; URLs inválidas recusadas, modelo da GPU e exportação conferidos.');
