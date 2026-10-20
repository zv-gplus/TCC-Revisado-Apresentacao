// Executar: node testes-validacoes.cjs. Inclui a regressão da versão anterior.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { context, evaluate, node, storage } = require('./testes.cjs');
const results = [];
function test(name, run) { run(); results.push({ name, status: 'passou' }); }
const state = (expression, id) => evaluate(`getExtendedChecks(${expression.parts}, ${expression.options || '{}'}).find(check => check.id === ${JSON.stringify(id)})?.state`);
const setup = {
  parts: `({board: DB.board.find(x=>x.id==='asus-tuf-b550m'), cpu:DB.cpu.find(x=>x.id==='ryzen5-5500'),gpu:DB.gpu.find(x=>x.id==='rtx4060'),psu:DB.psu.find(x=>x.id==='msi-a550bn-550w'),case:DB.case[0],cooler:DB.cooler[0]})`,
  options: `({biosVersion:'2423',gpuVariant:'msi-4060-ventus-oc',psuConfirmed:true,coolerKitConfirmed:true})`
};
test('BIOS desconhecida fica pendente', () => assert.equal(state({ ...setup, options: '{}' }, 'bios'), 'pending'));
test('BIOS anterior ao mínimo bloqueia', () => assert.equal(state({ ...setup, options: "{biosVersion:'1401'}" }, 'bios'), 'blocked'));
test('BIOS exatamente igual ao mínimo passa', () => assert.equal(state(setup, 'bios'), 'ok'));
test('BIOS posterior documentada passa', () => assert.equal(state({ ...setup, options: "{biosVersion:'2803'}" }, 'bios'), 'ok'));
test('Versão inventada não é aceita como posterior', () => assert.equal(state({ ...setup, options: "{biosVersion:'9999'}" }, 'bios'), 'pending'));
test('Par sem BIOS mínima confirmada permanece pendente', () => assert.equal(evaluate("getBiosCheck(DB.board[1], {...DB.cpu[0], id:'cpu-sem-ficha'}, '7D75v10').state"), 'pending'));
test('BIOS de outra placa não é reutilizada', () => assert.equal(evaluate("getBiosCheck(DB.board[4], DB.cpu.find(x=>x.id==='i9-14900k'), '2423').state"), 'pending'));
test('ASRock 6.02 é anterior a 10.02 para i9-14900K', () => assert.equal(evaluate("getBiosCheck(DB.board[4], DB.cpu.find(x=>x.id==='i9-14900k'), '6.02').state"), 'blocked'));
test('ASRock 10.02 aceita o mínimo do i9-14900K', () => assert.equal(evaluate("getBiosCheck(DB.board[4], DB.cpu.find(x=>x.id==='i9-14900k'), '10.02').state"), 'ok'));
test('ASRock i5-13600K e i7-13700K têm mínimo 6.02', () => {
  for (const cpu of ['i5-13600k', 'i7-13700k']) assert.equal(evaluate(`getBiosCheck(DB.board[4], DB.cpu.find(x=>x.id==='${cpu}'), '6.02').state`), 'ok');
});
test('Atualização de BIOS não resolve soquete errado', () => assert.equal(evaluate("getBiosCheck(DB.board[2], DB.cpu[1], '2803').state"), 'blocked'));
test('ASUS Z790 i9-14900K tem mínimo 1202', () => assert.equal(evaluate("getBiosCheck(DB.board[0], DB.cpu[1], '1202').state"), 'ok'));
test('Gabinete Q300L não aceita placa ATX', () => assert.equal(state({ parts: '({board:DB.board[1],case:DB.case[0]})' }, 'case-board'), 'blocked'));
test('Gabinete Q300L aceita Micro-ATX', () => assert.equal(state(setup, 'case-board'), 'ok'));
test('Gabinete 4000D aceita ATX', () => assert.equal(state({ parts: '({board:DB.board[1],case:DB.case[1]})' }, 'case-board'), 'ok'));
test('AK620 de 160mm excede os 159mm do Q300L', () => assert.equal(state({ parts: '({cooler:DB.cooler[1],case:DB.case[0]})' }, 'case-cooler'), 'blocked'));
test('AK400 de 155mm cabe no limite de 159mm', () => assert.equal(state(setup, 'case-cooler'), 'ok'));
test('Dimensão igual ao limite é aceita', () => assert.equal(state({ parts: '({cooler:{...DB.cooler[0],height:159},case:DB.case[0]})' }, 'case-cooler'), 'ok'));
test('Dimensão desconhecida não vira zero', () => assert.equal(state({ parts: '({cooler:{...DB.cooler[0],height:undefined},case:DB.case[0]})' }, 'case-cooler'), 'pending'));
test('Kit do cooler exige confirmação', () => assert.equal(state({ ...setup, options: '{}' }, 'cooler-socket'), 'pending'));
test('Soquete fora da lista do kit é bloqueado', () => assert.equal(state({ parts: '({cooler:{...DB.cooler[0],sockets:[\'AM4\']},cpu:DB.cpu[0]})' }, 'cooler-socket'), 'blocked'));
test('GPU genérica não recebe comprimento de Founders Edition', () => assert.equal(state({ ...setup, options: '{}' }, 'case-gpu'), 'pending'));
test('Variante de outra GPU é rejeitada', () => assert.equal(state({ ...setup, options: "{gpuVariant:'nvidia-4090-fe'}" }, 'case-gpu'), 'pending'));
test('Comprimento da Ventus usa ficha exata de 199mm', () => assert.equal(state(setup, 'case-gpu'), 'ok'));
test('GPU que ultrapassa o limite é bloqueada (fixture de limite)', () => {
  evaluate('GPU_VARIANTS[0].length = 361');
  try { assert.equal(state(setup, 'case-gpu'), 'blocked'); } finally { evaluate('GPU_VARIANTS[0].length = 199'); }
});
test('Fonte sem revisão confirmada mantém conectores pendentes', () => assert.equal(state({ ...setup, options: '{}' }, 'power-board'), 'pending'));
test('ATX24 e EPS4+4 atendem a B550M de CPU8', () => assert.equal(state(setup, 'power-board'), 'ok'));
test('EPS4+4 atende à conexão CPU4 da A520', () => assert.equal(state({ ...setup, parts: setup.parts.replace("'asus-tuf-b550m'", "'msi-a520m-a-pro'") }, 'power-board'), 'ok'));
test('Sem ficha de conectores da placa, continua pendente', () => assert.equal(state({ parts: '({board:DB.board[1],psu:DB.psu.find(x=>x.id===\'msi-a550bn-550w\')})', options: '{psuConfirmed:true}' }, 'power-board'), 'pending'));
test('Fonte ATX de 140mm cabe no Q300L de 160mm', () => assert.equal(state(setup, 'case-psu'), 'ok'));
test('Ausência comprovada de EPS bloqueia (fixture)', () => {
  evaluate("PSU_SPECS['msi-a550bn-550w'].eps44 = 0");
  try { assert.equal(state(setup, 'power-board'), 'blocked'); } finally { evaluate("PSU_SPECS['msi-a550bn-550w'].eps44 = 1"); }
});
test('PCIe6+2 atende a GPU de 8 pinos; não usa EPS', () => assert.equal(state(setup, 'power-gpu'), 'ok'));
test('Adaptador 16 pinos nunca é aprovado só contando plugs', () => assert.equal(state({ ...setup, parts: setup.parts.replace("'rtx4060'", "'rtx4090'"), options: "{gpuVariant:'nvidia-4090-fe',psuConfirmed:true}" }, 'power-gpu'), 'pending'));
test('Cabo nativo 450W da A750GL atende à conexão da 4090 FE', () => assert.equal(state({ ...setup, parts: setup.parts.replace("'rtx4060'", "'rtx4090'").replace("'msi-a550bn-550w'", "'msi-a750gl-750w'"), options: "{gpuVariant:'nvidia-4090-fe',psuConfirmed:true}" }, 'power-gpu'), 'ok'));
test('Potência sugerida da GPU não equivale ao estado dos conectores', () => assert.equal(state({ ...setup, parts: setup.parts.replace("'rtx4060'", "'rtx4090'").replace("'msi-a550bn-550w'", "'msi-a750gl-750w'"), options: "{gpuVariant:'nvidia-4090-fe',psuConfirmed:true}" }, 'gpu-psu-guidance'), 'pending'));
test('Térmica e folgas permanecem pendentes', () => assert.equal(state(setup, 'assembly-details'), 'pending'));
test('Agregação prioriza conflito sobre pendência e aprovação', () => {
  assert.equal(evaluate("summarizeChecks([{state:'ok'},{state:'pending'}])"), 'pending');
  assert.equal(evaluate("summarizeChecks([{state:'pending'},{state:'blocked'}])"), 'blocked');
  assert.equal(evaluate("summarizeChecks([{state:'ok'}])"), 'ok');
});
test('Salvar/restaurar inclui oito peças, BIOS e confirmações', () => {
  context.localStorage.setItem = (key, value) => storage.set(key, value);
  evaluate("applyBuild({...EXAMPLE_BUILDS.am4,gpu:'rtx4060'}, {biosVersion:'2423',gpuVariant:'msi-4060-ventus-oc',psuConfirmed:true,coolerKitConfirmed:true})");
  node('save-build').handlers.click();
  evaluate('applyBuild({})');
  evaluate('initBuilderTools()');
  assert.equal(node('build-case').value, 'q300l');
  assert.equal(node('bios-version').value, '2423');
  assert.equal(node('gpu-variant').value, 'msi-4060-ventus-oc');
  assert.equal(node('psu-model-confirmed').checked, true);
  assert.ok(evaluate('exportBuildText(readBuildParts())').includes('BIOS informada: 2423'));
  assert.ok(evaluate('exportBuildText(readBuildParts())').includes('Precisa conferir'));
});
test('Trocar placa-mãe apaga a BIOS anterior', () => {
  node('build-board').value = 'msi-a520m-a-pro';
  evaluate('updateBuild()');
  assert.equal(node('bios-version').value, '');
});
test('Trocar GPU descarta a variante física anterior', () => {
  node('build-gpu').value = 'rtx4090';
  evaluate('updateBuild()');
  assert.equal(node('gpu-variant').value, '');
});
test('Trocar fonte apaga a confirmação de revisão/cabos', () => {
  node('build-psu').value = 'msi-a750gl-750w';
  evaluate('updateBuild()');
  assert.equal(node('psu-model-confirmed').checked, false);
});
test('Trocar o soquete da CPU apaga a confirmação do kit', () => {
  evaluate("applyBuild({...EXAMPLE_BUILDS.am4}, {coolerKitConfirmed:true})");
  assert.equal(node('cooler-kit-confirmed').checked, true);
  node('build-cpu').value = 'ryzen5-7600x';
  evaluate('updateBuild()');
  assert.equal(node('cooler-kit-confirmed').checked, false);
});
test('IDs, versões e booleanos forjados no armazenamento são descartados', () => {
  assert.equal(evaluate("sanitizeValidationOptions({biosVersion:'9999',gpuVariant:'nvidia-4090-fe',psuConfirmed:'true'}, {board:'asus-tuf-b550m',gpu:'rtx4060',psu:'msi-a550bn-550w'}).biosVersion"), '');
  assert.equal(evaluate("sanitizeValidationOptions({gpuVariant:'nvidia-4090-fe'}, {gpu:'rtx4060'}).gpuVariant"), '');
  assert.equal(evaluate("sanitizeValidationOptions({psuConfirmed:'true'}, {psu:'msi-a550bn-550w'}).psuConfirmed"), false);
});
test('UI interrompe FPS por BIOS antiga e recupera ao corrigir', () => {
  evaluate("applyBuild({...EXAMPLE_BUILDS.am4,gpu:'rtx4060'}, {biosVersion:'1401'})");
  assert.ok(node('fps-games-area').innerHTML.includes('BIOS informada 1401'));
  node('bios-version').value = '2423';
  evaluate('updateBuild()');
  assert.ok(node('fps-games-area').innerHTML.includes('game-row'));
});
test('UI não bloqueia a simulação apenas por dado desconhecido', () => {
  node('bios-version').value = '';
  evaluate('updateBuild()');
  assert.ok(node('fps-games-area').innerHTML.includes('game-row'));
  assert.ok(node('compatibility-status').innerHTML.includes('pendentes'));
});
let catalogScenarios = 0;
test('Todos os resultados do catálogo têm estado e fonte válidos', () => {
  catalogScenarios = evaluate(`(() => { let count = 0; for (const board of DB.board) for (const cpu of DB.cpu) for (const chassis of DB.case) for (const cooler of DB.cooler) for (const psu of DB.psu) for (const gpu of DB.gpu) {
    count++;
    const checks = getExtendedChecks({board,cpu,case:chassis,cooler,psu,gpu}, {psuConfirmed:true});
    for (const check of checks) {
      if (!['ok','blocked','pending'].includes(check.state)) throw Error('Estado inválido');
      for (const source of check.sources) if (!OFFICIAL_SOURCES[source]?.url.startsWith('https://')) throw Error('Fonte inválida');
      if ((check.id==='case-gpu' || check.id==='power-gpu') && check.state!=='pending') throw Error('GPU genérica aprovada');
    }
  } return count; })()`);
});
const output = { date: new Date().toISOString().slice(0, 10), focusedTests: results.length, catalogScenarios, tests: results };
fs.writeFileSync(path.join(__dirname, 'resultado-validacoes.json'), JSON.stringify(output, null, 2));
console.log(`${results.length} testes focados passaram; ${catalogScenarios.toLocaleString('pt-BR')} cenários adicionais examinados.`);
