// Executar: node tests/precos.cjs. Não faz requisições às lojas.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {context,evaluate,node,storage}=require('../testes.cjs');
const results=[];
function test(name,run){run();results.push({name,status:'passou'});}

test('Preço da A520 usa a oferta e não o antigo exemplo de R$389',()=>{
 evaluate("applyBuild({board:'msi-a520m-a-pro'})");
 assert.equal(node('overview-total').textContent.replace(/\s/g,''),'R$376,99');
 assert.ok(node('detail-board').innerHTML.includes('Pichau'));
 assert.ok(node('detail-board').innerHTML.includes('19/10/2026'));
 assert.ok(node('detail-board').innerHTML.includes('À vista no Pix'));
 assert.ok(node('build-summary').innerHTML.includes('Ver na loja'));
});
test('Soma em centavos e subtotal indicam o preço que falta',()=>{
 evaluate("applyBuild({board:'msi-a520m-a-pro',cpu:'ryzen5-5500',cooler:'ak400',ram:'ddr4-16gb-3200'})");
 const q=evaluate('getBuildQuote(readBuildParts(),readValidationOptions())');
 assert.equal(q.totalCents,107697);assert.equal(q.priced,3);assert.equal(q.missing,1);
 assert.ok(node('overview-price-label').textContent.includes('Subtotal'));
 assert.ok(node('price-coverage').textContent.includes('3 de 4'));
 assert.ok(node('build-summary').innerHTML.includes('Preço não disponível'));
 assert.equal(node('mobile-total').textContent,node('overview-total').textContent);
});
test('Somente produtos sem preço não são apresentados como gratuitos',()=>{
 evaluate("applyBuild({ram:'ddr4-16gb-3200',gpu:'rtx4090'})");
 assert.equal(node('overview-total').textContent,'—');
 assert.ok(node('detail-gpu').innerHTML.includes('Selecione o modelo exato'));
 assert.ok(!node('build-summary').innerHTML.includes('R$ 0,00'));
});
test('Orçamento com preços faltando não afirma que sobra dinheiro',()=>{
 node('budget-limit').value='999999';evaluate('updateOverview(readBuildParts())');
 assert.ok(node('budget-status').textContent.includes('preços faltando'));
 assert.ok(!node('budget-status').textContent.includes('Restam'));
 evaluate("applyBuild({cpu:'ryzen5-5500',ram:'ddr4-16gb-3200'})");
 node('budget-limit').value='100';evaluate('updateOverview(readBuildParts())');
 assert.ok(node('budget-status').textContent.includes('subtotal já está acima'));
});
test('Quando todas as peças selecionadas têm preço, mostra total consultado',()=>{
 evaluate("applyBuild({cpu:'ryzen5-5500',cooler:'ak400'})");
 node('budget-limit').value='1000';evaluate('updateOverview(readBuildParts())');
 assert.equal(node('overview-total').textContent.replace(/\s/g,''),'R$699,98');
 assert.equal(node('overview-price-label').textContent,'Total das peças selecionadas');
 assert.ok(node('budget-status').textContent.includes('Restam'));
});
test('Produto esgotado preserva loja, modelo e link, mas não entra no total',()=>{
 evaluate("applyBuild({gpu:'rtx3060-12gb'},{gpuVariant:'asus-3060-dual-oc-v2'})");
 assert.ok(node('detail-gpu').innerHTML.includes('TerabyteShop'));
 assert.ok(node('detail-gpu').innerHTML.includes('Indisponível na consulta'));
 assert.equal(evaluate('getBuildQuote(readBuildParts(),readValidationOptions()).priced'),0);
 assert.ok(!node('detail-gpu').innerHTML.includes('2.214,50'));
});
test('GPU só usa oferta da variante exata e troca recalcula o resumo (fixture)',()=>{
 evaluate("globalThis.originalOffer=PRODUCT_OFFERS['gpu:asus-7600-dual-oc'];PRODUCT_OFFERS['gpu:asus-7600-dual-oc']={...originalOffer,status:'quoted',payment:'À vista no Pix',priceCents:199999}");
 try{
  evaluate("applyBuild({gpu:'rx7600'},{gpuVariant:'asus-7600-dual-oc'})");
  assert.equal(evaluate('getBuildQuote(readBuildParts(),readValidationOptions()).totalCents'),199999);
  node('gpu-variant').value='sapphire-7600-pulse';node('gpu-variant').handlers.change();
  assert.equal(node('overview-total').textContent,'—');
  assert.ok(!node('build-summary').innerHTML.includes('1999'));
  assert.equal(evaluate("getPartOffer('gpu',getItem('gpu','rtx4060'),{gpuVariant:'asus-7600-dual-oc'})"),null);
 }finally{evaluate("PRODUCT_OFFERS['gpu:asus-7600-dual-oc']=originalOffer;delete globalThis.originalOffer");}
});
test('Links perigosos, de busca ou de outro domínio não são exibidos',()=>{
 for(const url of ['javascript:alert(1)','http://www.pichau.com.br/produto-real','https://www.pichau.com.br.evil.test/produto-real','https://evil.test/produto-real','https://user:pass@www.pichau.com.br/produto-real','https://www.pichau.com.br/busca?q=cpu','https://www.pichau.com.br/produto-real?redirect=evil','https://www.pichau.com.br/']){
  assert.equal(evaluate(`validOffer({...PRODUCT_OFFERS['cpu:ryzen5-5500'],url:${JSON.stringify(url)}})`),false,url);
 }
});
test('Preço negativo, texto, infinito, zero, sem data ou com data impossível é rejeitado',()=>{
 for(const patch of ["priceCents:-1","priceCents:'55999'","priceCents:Infinity","priceCents:0","priceCents:1.5","checkedAt:''","checkedAt:'2026-02-30'","checkedAt:'2099-01-01'","store:'Loja desconhecida'"]){
  assert.equal(evaluate(`validOffer({...PRODUCT_OFFERS['cpu:ryzen5-5500'],${patch}})`),false,patch);
 }
});
test('Salvar/restaurar mantém os IDs e ignora preço forjado no armazenamento',()=>{
 context.localStorage.setItem=(key,value)=>storage.set(key,value);
 evaluate("applyBuild({board:'msi-a520m-a-pro'})");node('save-build').handlers.click();
 const saved=JSON.parse(storage.get('ntj-builder-v1'));saved.priceCents=1;saved.parts.price=1;saved.options.offerUrl='https://evil.test';storage.set('ntj-builder-v1',JSON.stringify(saved));
 evaluate('applyBuild({});initBuilderTools()');
 assert.equal(node('overview-total').textContent.replace(/\s/g,''),'R$376,99');
 assert.ok(!node('build-summary').innerHTML.includes('evil.test'));
});
test('Exportação informa valor, loja, SKU, condição, data, link e preços faltantes',()=>{
 evaluate("applyBuild({cpu:'ryzen5-5500',ram:'ddr4-16gb-3200'})");
 const output=evaluate('exportBuildText(readBuildParts())');
 for(const word of ['559,99','Pichau','100-100000457BOX','À vista no Pix','19/10/2026','https://www.pichau.com.br/','Subtotal','sem preço','Frete não incluído'])assert.ok(output.includes(word),word);
 assert.ok(!output.includes('Total ilustrativo'));
});
test('Comparador não inventa diferença quando falta um preço',()=>{
 evaluate("currentCompareType='cpu';document.getElementById('compare-left').value='ryzen5-5500';document.getElementById('compare-right').value='i9-14900k';runComparison()");
 assert.ok(node('compare-result-area').innerHTML.includes('Não há duas ofertas confirmadas'));
 evaluate("document.getElementById('compare-right').value='ryzen5-7600x';runComparison()");
 assert.ok(node('compare-result-area').innerHTML.includes('530,00'));
});
test('Todas as ofertas são válidas, apontam para item existente e têm vendedor explícito',()=>{
 evaluate(`for(const [key,offer]of Object.entries(PRODUCT_OFFERS)){
  if(!validOffer(offer))throw Error('Oferta inválida: '+key);
  const [type,id]=key.split(':');
  if(type==='gpu'?!GPU_VARIANTS.some(x=>x.id===id):!getItem(type,id))throw Error('Peça ausente: '+key);
  if(offer.status==='unavailable'&&offer.priceCents!==null)throw Error('Esgotado tem preço ativo');
 }`);
});
fs.writeFileSync('resultado-precos.json',JSON.stringify({date:new Date().toISOString().slice(0,10),tests:results,offers:evaluate('Object.values(PRODUCT_OFFERS).filter(x=>x.status===\'quoted\').length'),unavailable:evaluate('Object.values(PRODUCT_OFFERS).filter(x=>x.status===\'unavailable\').length')},null,2));
console.log(`${results.length} testes de ofertas, soma, modelo exato, entradas inválidas e exportação passaram.`);
