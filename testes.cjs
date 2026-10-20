// Execute: node testes.cjs. Usa somente módulos que acompanham o Node.js.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = path.join(__dirname, 'frontend');
const nodes = new Map();
function makeNode() {
  const classes = new Set();
  return {
    get className() { return [...classes].join(' '); },
    set className(value) { classes.clear(); for (const name of value.split(/\s+/).filter(Boolean)) classes.add(name); },
    value: '', checked: true, innerHTML: '', textContent: '', style: {}, options: [{}], handlers: {}, attributes: {}, dataset: {},
    add(option) { this.options.push(option); },
    replaceChildren(...options) { this.options = options; },
    classList: { add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x), toggle(x, active) { active ? classes.add(x) : classes.delete(x); } },
    setAttribute(key, value) { this.attributes[key] = value; },
    appendChild(option) { this.options.push(option); },
    after(node) { nodes.set(node.id, node); },
    closest() { return this; },
    addEventListener(type, handler) { this.handlers[type] = handler; },
    querySelector() { return this; }
  };
}
function node(id) { if (!nodes.has(id)) nodes.set(id, makeNode()); return nodes.get(id); }
const storage = new Map();
const windowHandlers = {};
const context = vm.createContext({ console, Intl, Blob, setTimeout, URL, URLSearchParams, window: {matchMedia: () => ({matches:false,addEventListener(){}}), addEventListener: (type, handler) => {windowHandlers[type] = handler;}}, location: {href:'https://ntj.test/',hash:''}, navigator: {}, Option: function(text, value) { return { textContent: text, value, disabled: false }; }, localStorage: {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key)
}, document: {
  body: node('body'), documentElement: node('html'), readyState: 'complete',
  getElementById: node,
  createElement: makeNode,
  querySelectorAll: selector => selector.startsWith('select') ? ['board', 'cpu', 'gpu', 'ram', 'ssd', 'psu', 'case', 'cooler'].map(type => node('build-' + type)) : []
} });
for (const file of ['tema.js', 'dados.js', 'dados-validados.js', 'ofertas.js', 'precos.js', 'compatibilidade.js', 'validacoes.js', 'interface-validacoes.js', 'compartilhar.js', 'script.js']) vm.runInContext(fs.readFileSync(path.join(base, file), 'utf8'), context, { filename: file });
const evaluate = code => vm.runInContext(code, context);
const report = evaluate(`(() => {
  // Expectativas independentes das funções de produção, com base no catálogo.
  const cpuSockets = { 'ryzen9-7950x': 'AM5', 'ryzen7-7700x': 'AM5', 'ryzen5-7600x': 'AM5', 'ryzen5-5500': 'AM4', 'i9-14900k': 'LGA1700', 'i7-13700k': 'LGA1700', 'i5-13600k': 'LGA1700', 'i3-12100f': 'LGA1700' };
  const boardRules = { 'asus-z790e-strix': ['LGA1700', 'DDR5'], 'msi-b650-tomahawk': ['AM5', 'DDR5'], 'asus-tuf-b550m': ['AM4', 'DDR4'], 'msi-a520m-a-pro': ['AM4', 'DDR4'], 'asrock-b660m-phantom': ['LGA1700', 'DDR4'] };
  const ddr5 = new Set(['ddr5-32gb-6000', 'ddr5-16gb-5600', 'ddr5-64gb-6000-cl30']);
  const rows = [];
  const counts = { triples: 0, allowed: 0, blocked: 0, socketOnly: 0, ramOnly: 0, both: 0, fullBuilds: 0, fullAllowed: 0, fullBlocked: 0, power: { ok: 0, warn: 0, danger: 0 }, comparisons: 0 };
  for (const [type, items] of Object.entries(DB)) {
    const ids = new Set();
    for (const item of items) {
      if (ids.has(item.id)) throw Error('ID repetido: ' + item.id);
      ids.add(item.id);
    }
  }
  for (const board of DB.board) for (const cpu of DB.cpu) for (const ram of DB.ram) {
    const [socket, memory] = boardRules[board.id];
    const wrongCPU = socket !== cpuSockets[cpu.id];
    const wrongRAM = memory !== (ddr5.has(ram.id) ? 'DDR5' : 'DDR4');
    const issues = getCompatibilityIssues(board, cpu, ram);
    if (issues.length !== Number(wrongCPU) + Number(wrongRAM)) throw Error('Regra divergente');
    if (issues.some(issue => !issue.message.includes(board.name))) throw Error('Mensagem sem placa-mãe');
    if (wrongCPU && !issues.some(issue => issue.field === 'cpu' && issue.message.includes(cpu.name))) throw Error('Mensagem sem CPU');
    if (wrongRAM && !issues.some(issue => issue.field === 'ram' && issue.message.includes(ram.name))) throw Error('Mensagem sem RAM');
    counts.triples++;
    counts[issues.length ? 'blocked' : 'allowed']++;
    if (wrongCPU && wrongRAM) counts.both++;
    else if (wrongCPU) counts.socketOnly++;
    else if (wrongRAM) counts.ramOnly++;
    applyBuild({ board: board.id, cpu: cpu.id, ram: ram.id, gpu: DB.gpu[0].id });
    const fps = document.getElementById('fps-games-area').innerHTML;
    if (issues.length && !fps.includes('conflitos confirmados')) throw Error('FPS não bloqueado');
    if (!issues.length && !fps.includes('game-row')) throw Error('FPS bloqueado indevidamente');
    const parts = readBuildParts();
    for (const type of ['board', 'cpu', 'ram']) for (const option of document.getElementById('build-' + type).options) {
      const candidate = getItem(type, option.value);
      if (!candidate) continue;
      const next = { ...parts, [type]: candidate };
      const conflict = getCompatibilityIssues(next.board, next.cpu, next.ram).some(issue => type === 'board' || issue.field === type);
      const expectedDisabled = conflict && option.value !== document.getElementById('build-' + type).value;
      if (option.disabled !== expectedDisabled) throw Error('Filtro divergente: ' + type);
    }
    rows.push({ board: board.name, cpu: cpu.name, ram: ram.name, status: issues.length ? 'Bloqueia FPS' : 'Sem conflito nas regras', reasons: issues.map(issue => issue.message) });
    for (const gpu of DB.gpu) for (const ssd of DB.ssd) for (const psu of DB.psu) {
      const parts = { board, cpu, ram, gpu, ssd, psu };
      const expectedWatts = 20 + board.tdp + cpu.tdp + gpu.tdp + ram.tdp + ssd.tdp;
      if (getPowerEstimate(parts) !== expectedWatts) throw Error('Consumo divergente');
      const level = expectedWatts > psu.watts ? 'danger' : expectedWatts > psu.watts * 0.8 ? 'warn' : 'ok';
      if (getPowerLevel(expectedWatts, psu.watts) !== level) throw Error('Estado da fonte divergente');
      counts.power[level]++;
      counts.fullBuilds++;
      counts[issues.length ? 'fullBlocked' : 'fullAllowed']++;
    }
  }
  for (const type of ['cpu', 'gpu', 'ram', 'ssd', 'board']) {
    currentCompareType = type;
    for (const a of DB[type]) for (const b of DB[type]) {
      document.getElementById('compare-left').value = a.id;
      document.getElementById('compare-right').value = b.id;
      runComparison();
      for (const metric of getCompareMetrics(a, type)) if (!Number.isFinite(metric.score) || metric.score < 0 || metric.score > 100) throw Error('Nota fora da escala');
      counts.comparisons++;
    }
  }
  applyBuild(EXAMPLE_BUILDS.am4);
  if (getCompatibilityIssues(...['board', 'cpu', 'ram'].map(type => readBuildParts()[type])).length) throw Error('Exemplo AM4');
  applyBuild(EXAMPLE_BUILDS.am5);
  if (getCompatibilityIssues(...['board', 'cpu', 'ram'].map(type => readBuildParts()[type])).length) throw Error('Exemplo AM5');
  document.getElementById('compatible-only').checked = false;
  updateBuild();
  if (document.getElementById('build-cpu').options.some(option => option.disabled)) throw Error('Filtro desligado');
  return { counts, rows, boardRules };
})()`);
assert.equal(evaluate("escapeHTML('<img onerror=alert(1)>').includes('<img')"), false);
assert.equal(evaluate('getPowerEstimate({})'), 0);
assert.equal(evaluate('getPowerLevel(800, 1000)'), 'ok');
assert.equal(evaluate('getPowerLevel(801, 1000)'), 'warn');
assert.equal(evaluate('getPowerLevel(1000, 1000)'), 'warn');
assert.equal(evaluate('getPowerLevel(1001, 1000)'), 'danger');
assert.equal(evaluate('getPowerLevel(500, null)'), 'pending');
assert.equal(evaluate('normalizeSavedBuild({version: 999, parts: {}})'), null);
assert.equal(evaluate("normalizeSavedBuild({version:1,parts:{cpu:'<script>'},budget:-1}).parts.cpu"), '');
assert.equal(evaluate("normalizeSavedBuild({version:1,parts:{},budget:'Infinity'}).budget"), '');
node('budget-limit').value = '1';
evaluate('updateOverview(readBuildParts())');
assert.ok(/acima/i.test(node('budget-status').textContent));
node('save-build').handlers.click();
assert.equal(storage.size, 1);
evaluate('applyBuild({})');
evaluate('initBuilderTools()');
assert.ok(node('build-cpu').value);
assert.ok(evaluate('exportBuildText(readBuildParts())').includes('Subtotal com preços disponíveis'));
node('clear-build').handlers.click();
assert.equal(storage.size, 0);
assert.equal(node('build-cpu').value, '');
assert.equal(node('overview-total').textContent.replace(/\s/g, ''), 'R$0,00');
for (const watts of [100, 850, 1100]) {
  evaluate(`updatePowerSection(null, {tdp:${watts}}, null, null, null, {watts:1000})`);
  assert.ok(node('power-card').classList.contains(watts === 100 ? 'power-ok' : watts === 850 ? 'power-warn' : 'power-danger'));
}
// Dados corrompidos ou armazenamento bloqueado não podem derrubar o aplicativo.
storage.set('ntj-builder-v1', '{inválido');
evaluate('initBuilderTools()');
assert.ok(node('save-status').textContent.includes('Não foi possível'));
evaluate("localStorage.setItem = () => { throw Error('bloqueado'); }");
node('save-build').handlers.click();
assert.ok(node('save-status').textContent.includes('não permitiu'));
const html = fs.readFileSync(path.join(base, 'index.html'), 'utf8');
assert.ok(!/\son(?:click|change)=/.test(html));
for (const file of ['tema.js', 'dados.js', 'compatibilidade.js', 'script.js', 'style.css']) assert.ok(html.includes(file));
fs.writeFileSync(path.join(__dirname, 'resultado-testes.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.counts, null, 2));
console.log('Regressão passou; estes testes usam um DOM simulado, sem ensaios de bancada.');
module.exports = { context, evaluate, node, storage, windowHandlers };
