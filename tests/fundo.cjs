// Executar: node tests/fundo.cjs. Sem dependências externas.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const css=fs.readFileSync('frontend/style.css','utf8');
const palette=selector=>Object.fromEntries([...css.match(selector)[1].matchAll(/(--[a-z-]+):\s*(#[a-fA-F0-9]+);/g)].map(m=>[m[1],m[2]]));
const light=palette(/:root\s*\{([^}]+)\}/);
const dark={...light,...palette(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/)};
function composite(bg,fg,a){return '#'+[1,3,5].map(i=>Math.round(parseInt(bg.slice(i,i+2),16)*(1-a)+parseInt(fg.slice(i,i+2),16)*a).toString(16).padStart(2,'0')).join('');}
function luminance(hex){const h=hex.slice(1);const s=h.length===3?h.split('').map(x=>x+x).join(''):h;const c=[0,2,4].map(i=>parseInt(s.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
function ratio(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
const strokes=['#b57fae','#ba9a65','#6da7b9','#70ab91'];
let comparisons=0;
for(const [theme,p,alpha,plates]of [['claro',light,.38,['#f2f4f6','#e7ebef','#dce2e8']],['escuro',dark,.8,['#192029','#10161e','#28323e']]]){
 for(const plate of plates)for(const stroke of strokes){
  let bg=composite(p['--pcb-bg'],plate,alpha);
  bg=composite(bg,stroke,.13*alpha);bg=composite(bg,stroke,.24*alpha);
  for(const fg of ['--silk','--silk-dim','--silk-faint','--copper']){const value=ratio(p[fg],bg);assert.ok(value>=4.5,theme+' '+fg+' contraste '+value);comparisons++;}
 }
}
for(const file of ['textura-rgb.svg','textura-rgb-claro.svg']){const svg=fs.readFileSync('frontend/'+file,'utf8');assert.ok(svg.includes('id="plate"'));assert.ok(!/<(?:script|image|animate)/i.test(svg));assert.ok(!/href="(?!#)/.test(svg));assert.ok(Buffer.byteLength(svg)<16000);for(const color of strokes)assert.ok(svg.includes(color));}
assert.ok(css.includes('pointer-events: none')&&css.includes('isolation: isolate'));
assert.ok(css.includes('url("textura-rgb-claro.svg")')&&css.includes('url("textura-rgb.svg")'));
assert.ok(!/animation:/.test(css.replace('animation: none !important;','')));
fs.writeFileSync('resultado-fundo.json',JSON.stringify({comparisons,style:'Hexágonos com RGB fosco, estáticos e sem recursos externos',limits:'Análise de SVG/CSS e DOM simulado; sem conferência visual em navegador.'},null,2));
console.log('Fundo RGB: '+comparisons+' verificações de contraste, dois temas e SVGs locais passaram.');
