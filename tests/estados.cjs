const assert = require('node:assert/strict');
const {evaluate,node}=require('../testes.cjs');
for(const [amount,stage]of [[0,'start'],[1,'start'],[3,'start'],[4,'half'],[7,'half'],[8,'complete']]) {
 evaluate(`applyBuild(Object.fromEntries(Object.entries(EXAMPLE_BUILDS.am5).slice(0,${amount})))`);
 assert.equal(node('build-progress').value,amount);
 assert.equal(node('build-progress').dataset.stage,stage);
 assert.ok(node('build-progress').attributes['aria-valuetext'].includes('compatibilidade verificada separadamente'));
 const values=JSON.parse(evaluate('JSON.stringify(Object.fromEntries(BUILD_TYPES.map(type=>[type,!!readBuildParts()[type]])))'));
 for(const [type,selected]of Object.entries(values)) assert.equal(node('build-'+type).classList.contains('component-empty'),!selected);
}
assert.ok(node('build-summary').innerHTML.includes('class="summary-total"'));
assert.equal(node('overview-total').textContent,node('mobile-total').textContent);
assert.ok(node('compatibility-status').className.includes('has-pending'));
// Ter todas as categorias não torna uma montagem incompatível válida.
evaluate("applyBuild({...EXAMPLE_BUILDS.am5,cpu:'ryzen5-5500'})");
assert.equal(node('build-progress').dataset.stage,'complete');
assert.ok(node('compatibility-status').className.includes('has-issues'));
assert.ok(node('build-cpu').classList.contains('component-invalid'));
assert.ok(node('fps-games-area').innerHTML.includes('conflitos confirmados'));
evaluate("currentCompareType='cpu';document.getElementById('compare-left').value='';document.getElementById('compare-right').value='';runComparison()");
assert.ok(node('compare-left').classList.contains('is-empty'));
evaluate("document.getElementById('compare-left').value=DB.cpu[0].id;runComparison()");
assert.equal(node('compare-left').classList.contains('is-empty'),false);
assert.ok(node('compare-right').classList.contains('is-empty'));
evaluate('applyBuild({})');
assert.equal(node('build-progress').dataset.stage,'start');
assert.ok(!node('build-summary').innerHTML.includes('summary-total'));
console.log('Estados: campos vazios/selecionados, fases 0–8, totais sincronizados e conflito com 8/8 passaram.');
