// Teste controlado da aplicação, sem tráfego de carga contra a hospedagem.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const {DatabaseSync} = require('node:sqlite');
const {performance} = require('node:perf_hooks');
const {jsx,jsxs} = require('react/jsx-runtime');
const FIXED_NOW = Date.now();
class Clock extends Date {static now() {return FIXED_NOW;}}
function load(path,deps) {
  const exports = {};
  const js = ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  vm.runInNewContext(js,{exports,require: name => {if(!(name in deps))throw Error(name);return deps[name]},crypto:globalThis.crypto,TextEncoder,TextDecoder,Request,Response,Uint8Array,URL,Date:Clock});
  return exports;
}
(async()=>{
 const events = await import('../server/eventos.mjs');
 const {secureResponse} = await import('../server/resposta-segura.mjs');
 const checks=[];
 // Exercita a página real: nenhuma consulta pode ocorrer antes da autorização.
 let queries=0;let user=null;
 const auth={getChatGPTUser:async()=>user,chatGPTSignInPath:p=>'/signin-with-chatgpt?return_to='+encodeURIComponent(p),chatGPTSignOutPath:()=>'/signout-with-chatgpt'};
 const admin=load('app/gestao-ntj-7f42b9c1/page.tsx',{
  'react/jsx-runtime':{jsx,jsxs},'cloudflare:workers':{env:{ADMIN_EMAIL:'owner@example.test'}},
  'next/headers':{headers:async()=>new Headers()},'../chatgpt-auth':auth,
  '../../server/eventos.mjs':events,'../../server/logs':{allowRequest:async()=>false,writeEvent:async()=>{},listEvents:async()=>{queries++;return {rows:[{id:1,at:FIXED_NOW,type:'uso',code:'abrir_site',origin:'navegador'}],counts:[]}}},
 }).default;
 for(const candidate of [null,{userId:'other',email:'other@example.test'},{email:'owner@example.test'}]) {
  user=candidate;const result=await admin({searchParams:Promise.resolve({tipo:'uso'})});
  assert.ok(JSON.stringify(result).includes('Somente a conta autorizada'));assert.equal(queries,0);
 }
 user={userId:'owner',email:'owner@example.test'};
 assert.ok(JSON.stringify(await admin({searchParams:Promise.resolve({tipo:"uso' OR 1=1 --"})})).includes('Registros do site'));
 assert.equal(queries,1);
 user=null;await admin({searchParams:Promise.resolve({})});assert.equal(queries,1);
 checks.push('Página real: anônimo, outra conta e identidade incompleta não consultam o banco; conta autorizada consulta; saída perde acesso. Identidades simuladas.');
 for(const suffix of ['', '?_rsc=teste', '?tipo=uso']) {
  const response=secureResponse(new Response('conteudo',{headers:{Vary:'RSC'}}));
  assert.match(response.headers.get('Cache-Control'),/private, no-store/);
  assert.equal(response.headers.get('CDN-Cache-Control'),'no-store');
  assert.equal(response.headers.get('Cloudflare-CDN-Cache-Control'),'no-store');
  assert.match(response.headers.get('Vary'),/Cookie/);
 }
 checks.push('Cabeçalhos de cache privados e no-store no wrapper de todas as respostas dinâmicas. Cache da infraestrutura não exercitado.');
 assert.ok(!fs.existsSync('app/admin'));
 assert.ok(!fs.existsSync('public/admin'));
 assert.equal(events.normalizeEvent({type:'seguranca',code:'acesso_negado'}),null);
 assert.equal(events.normalizeEvent({type:'uso',code:'abrir_site',email:'owner@example.test'}).code,'abrir_site');
 checks.push('Sem rota /admin ou arquivo público de painel; eventos não autorizam acesso nem aceitam registros de segurança do cliente.');
 const results=[];
 for(const scenario of ['uma_origem','50_origens','4_instancias']) {
  const sqlite=new DatabaseSync(':memory:');
  sqlite.exec(fs.readFileSync('drizzle/0000_abnormal_king_bedlam.sql','utf8'));
  let statements=0;
  function prepare(sql){let args=[];const item={bind(...values){args=values;return item},execute(){statements++;return /RETURNING|^SELECT/.test(sql)?{results:sqlite.prepare(sql).all(...args)}:sqlite.prepare(sql).run(...args)},async run(){return item.execute()},async all(){return item.execute()}};return item;}
  const env={DB:{prepare,batch:async items=>{sqlite.exec('BEGIN');try{const rows=items.map(item=>item.execute());sqlite.exec('COMMIT');return rows}catch(e){sqlite.exec('ROLLBACK');throw e}}},LOG_RATE_SECRET:'only-for-testing'};
  const routes=Array.from({length:scenario==='4_instancias'?4:1},()=>{
    const logs=load('server/logs.ts',{'cloudflare:workers':{env}});
    return load('app/api/eventos/route.ts',{'../../../server/logs':logs,'../../../server/eventos.mjs':events});
  });
  const status={};let index=0;const begin=performance.now();
  async function worker(){while(index<1000){const i=index++;const ip=scenario==='uma_origem'?'192.0.2.1':'192.0.2.'+(i%50+1);const request=new Request('https://test.local/api/eventos',{method:'POST',headers:{origin:'https://test.local','content-type':'application/json','cf-connecting-ip':ip},body:JSON.stringify({type:'uso',code:'comparar'})});const response=await routes[i%routes.length].POST(request);status[response.status]=(status[response.status]||0)+1;}}
  await Promise.all(Array.from({length:20},worker));
  const accepted=scenario==='uma_origem'?30:300;
  assert.equal(status[204],accepted);assert.equal(status[429],1000-accepted);assert.equal(status[503],undefined);
  if(scenario!=='4_instancias') assert.ok(statements<1000,'Requisições bloqueadas não devem executar limpeza ou contagem no banco repetidamente.');
  const summary={scenario,requests:1000,concurrency:20,status,sqlStatements:statements,durationMs:Math.round(performance.now()-begin)};results.push(summary);sqlite.close();
 }
 const report={testedAt:new Date().toISOString(),environment:'Node + SQLite em memória; sem rede/Cloudflare/D1 real',checks,load:results,notVerified:['Login real com duas contas','Rejeição de cabeçalhos de identidade falsificados pela infraestrutura','Cache e limites de infraestrutura em produção','Resistência a DDoS']};
 fs.writeFileSync('resultado-seguranca.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
})();
