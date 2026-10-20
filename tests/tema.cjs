const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const postcss = require('node:module').createRequire(require.resolve('@tailwindcss/postcss'))('postcss');
const script = fs.readFileSync('frontend/tema.js','utf8');
function setup({saved=null,dark=false,blocked=false,loading=false,withButton=true,withMedia=true}={}) {
  const storage = new Map([['ntj-builder-v1','montagem-intacta']]);
  if(saved!==null)storage.set('ntj-theme',saved);
  const attrs={};const label={};const events={};const root={dataset:{}};const button={hidden:true,setAttribute:(k,v)=>attrs[k]=v,querySelector:()=>label,addEventListener:(k,fn)=>events[k]=fn};
  const media={matches:dark,addEventListener:(name,fn)=>events.system=fn};
  const document={documentElement:root,readyState:loading?'loading':'complete',getElementById:()=>withButton?button:null,addEventListener:(name,fn)=>events[name]=fn};
  const localStorage={getItem:key=>{if(blocked)throw Error();return storage.get(key)??null},setItem:(key,value)=>{if(blocked)throw Error();storage.set(key,value)}};
  vm.runInNewContext(script,{document,window:withMedia?{matchMedia:()=>media}:{},localStorage});
  return {root,storage,events,attrs,button,label};
}
let count=0;
for(const dark of [false,true])for(const saved of [null,'light','dark','<script>']) {
 const x=setup({dark,saved});const initial=['light','dark'].includes(saved)?saved:dark?'dark':'light';
 assert.equal(x.root.dataset.theme,initial);
 assert.equal(x.attrs['aria-pressed'],String(initial==='dark'));
 x.events.click();assert.notEqual(x.root.dataset.theme,initial);
 assert.equal(x.storage.get('ntj-theme'),x.root.dataset.theme);
 assert.equal(x.storage.get('ntj-builder-v1'),'montagem-intacta');
 const reloaded=setup({saved:x.storage.get('ntj-theme'),dark:!dark});assert.equal(reloaded.root.dataset.theme,x.root.dataset.theme);
 count++;
}
const blocked=setup({dark:true,blocked:true});blocked.events.click();assert.equal(blocked.root.dataset.theme,'light');blocked.events.system({matches:true});assert.equal(blocked.root.dataset.theme,'light');
const auto=setup();auto.events.system({matches:true});assert.equal(auto.root.dataset.theme,'dark');
const early=setup({dark:true,loading:true});assert.equal(early.root.dataset.theme,'dark');early.events.DOMContentLoaded();assert.equal(early.button.hidden,false);
assert.equal(setup({withButton:false,dark:true}).root.dataset.theme,'dark');
assert.equal(setup({withMedia:false}).root.dataset.theme,'light');
// Avalia os pares reais da paleta: WCAG AA para texto normal (4,5:1).
const css=fs.readFileSync('frontend/style.css','utf8');const ast=postcss.parse(css);const palettes={light:{},dark:{}};
ast.nodes.filter(n=>n.type==='rule'&&[':root',':root[data-theme="dark"]'].includes(n.selector)).forEach(rule=>{const target=rule.selector===':root'?palettes.light:palettes.dark;rule.nodes.filter(n=>n.type==='decl').forEach(d=>target[d.prop]=d.value)});
palettes.dark={...palettes.light,...palettes.dark};
function luminance(hex){const h=hex.slice(1);const s=h.length===3?h.split('').map(n=>n+n).join(''):h;const c=[0,2,4].map(i=>parseInt(s.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722}
function ratio(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
const contrast=[];
for(const [theme,p]of Object.entries(palettes)) {
 const pairs=[...['--silk','--silk-dim','--silk-faint','--copper'].flatMap(fg=>['--pcb-bg','--pcb-panel','--pcb-panel-2'].map(bg=>[fg,bg])),['--on-action','--action-bg'],['--on-action','--action-hover'],['--ok-text','--ok-bg'],['--warn-text','--warn-bg'],['--danger-text','--danger-bg'],['--on-blocked','--blocked-badge-bg'],['--accent-text','--accent-surface'],['--copper','--accent-surface']];
 for(const [fg,bg]of pairs){const value=ratio(p[fg],p[bg]);assert.ok(value>=4.5,`${theme}: ${fg}/${bg} = ${value.toFixed(2)}`);contrast.push({theme,fg,bg,ratio:Number(value.toFixed(2))})}
 assert.ok(ratio(p['--control-line'],p['--pcb-panel'])>=3);
}
// Contraste conservador do texto diretamente sobre uma linha RGB, sem a máscara.
const strokeColors=['#b57fae','#ba9a65','#6da7b9','#70ab91'];
function composite(bg,fg,alpha) {
 const a=bg.slice(1),b=fg.slice(1);
 return '#'+[0,2,4].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-alpha)+parseInt(b.slice(i,i+2),16)*alpha).toString(16).padStart(2,'0')).join('');
}
for(const [mode,p] of Object.entries(palettes)) for(const stroke of strokeColors) {
 const bg=composite(p['--pcb-bg'],stroke,mode==='dark'?.16:.12);
 for(const fg of ['--silk','--silk-dim','--silk-faint','--copper']) assert.ok(ratio(p[fg],bg)>=4.5,`Textura: ${mode}/${fg}/${stroke}`);
}
assert.ok(fs.existsSync('frontend/textura-rgb.svg'));
assert.ok(css.includes('pointer-events: none') && css.includes('isolation: isolate'));
assert.ok(!/animation:/.test(css.replace('animation: none !important;', '')), 'A textura deve permanecer estática.');
const html=fs.readFileSync('frontend/index.html','utf8');assert.ok(html.indexOf('src="tema.js"')<html.indexOf('href="style.css"'));
fs.writeFileSync('resultado-tema.json',JSON.stringify({scenarios:count,contrast,limits:'DOM simulado e análise de CSS; sem conferência visual em navegador.'},null,2));
console.log(`Tema: ${count} combinações de preferência, falhas de armazenamento, inicialização e ${contrast.length} pares de contraste passaram.`);

// Troca pelo botão real com o montador inicializado: seleção e resultados intactos.
const {evaluate,node,storage}=require('../testes.cjs');
evaluate('applyBuild(EXAMPLE_BUILDS.am5)');
node('budget-limit').value='8000';
evaluate('updateBuild()');
const original=evaluate('exportBuildText(readBuildParts())');
const shared=evaluate('createBuildLink()');
const checks=node('extended-checks').innerHTML;
for(const mode of ['dark','light','dark','light']) {
 node('theme-toggle').handlers.click();
 assert.equal(node('html').dataset.theme,mode);
 assert.equal(evaluate('exportBuildText(readBuildParts())'),original);
 assert.equal(evaluate('createBuildLink()'),shared);
 assert.equal(node('extended-checks').innerHTML,checks);
 evaluate("document.getElementById('compare-left').value=DB.cpu[0].id;document.getElementById('compare-right').value=DB.cpu[1].id;runComparison()");
 assert.ok(node('compare-result-area').innerHTML.includes('comparison-results'));
}
console.log('Integração: alternar o tema preserva peças, orçamento, resumo, link e verificações. Comparador permanece funcionando.');
