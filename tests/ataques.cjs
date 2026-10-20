// Ensaios de segurança do aplicativo: sem atingir serviços de terceiros.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const {DatabaseSync}=require('node:sqlite');
const {jsx,jsxs}=require('react/jsx-runtime');
const {renderToStaticMarkup}=require('react-dom/server');
function load(file,deps) {
 const exports={};
 const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(js,{exports,require:name=>{if(!(name in deps))throw Error(name);return deps[name]},crypto:globalThis.crypto,TextEncoder,TextDecoder,Request,Response,Uint8Array,URL,Date});
 return exports;
}
(async()=>{
 const catalog=await import('../server/eventos.mjs');
 const {secureResponse}=await import('../server/resposta-segura.mjs');
 const sqlite=new DatabaseSync(':memory:');
 sqlite.exec(fs.readFileSync('drizzle/0000_abnormal_king_bedlam.sql','utf8'));
 function prepare(sql){let args=[];const statement={bind(...a){args=a;return statement},exec(){return /RETURNING|^SELECT/.test(sql)?{results:sqlite.prepare(sql).all(...args)}:sqlite.prepare(sql).run(...args)},async run(){return statement.exec()},async all(){return statement.exec()}};return statement;}
 const env={DB:{prepare,batch:async statements=>{sqlite.exec('BEGIN');try{const rows=statements.map(s=>s.exec());sqlite.exec('COMMIT');return rows}catch(e){sqlite.exec('ROLLBACK');throw e}}},LOG_RATE_SECRET:'only-a-fixture'};
 const logs=load('server/logs.ts',{'cloudflare:workers':{env}});
 const api=load('app/api/eventos/route.ts',{'../../../server/logs':logs,'../../../server/eventos.mjs':catalog});
 const unknown=load('app/[...path]/route.ts',{'../../server/logs':logs,'../../server/eventos.mjs':catalog});
 const results=[];let sequence=0;
 function request(body,headers={}) {return new Request('https://site.test/api/eventos',{method:'POST',headers:{origin:'https://site.test','content-type':'application/json','cf-connecting-ip':'192.0.2.'+(++sequence),...headers},body:typeof body==='string'?body:JSON.stringify(body)})}
 for(const origin of ['https://outro.test','https://site.test.evil.test','null','']) {
  const response=await api.POST(request({type:'uso',code:'abrir_site'},{origin}));
  assert.equal(response.status,403);assert.equal(response.headers.get('access-control-allow-origin'),null);
 }
 results.push({test:'Requisições de outro site',status:'passou localmente',detail:'Quatro origens não autorizadas recusadas com 403; sem liberação CORS na resposta da rota.'});
 for(const payload of ['{invalido','[]','null','42',JSON.stringify({type:'uso',code:'x'.repeat(1000)})]) assert.equal((await api.POST(request(payload))).status,400);
 assert.equal((await api.POST(request({type:'uso',code:'abrir_site'},{'content-type':'text/plain'}))).status,400);
 const streamed=new Request('https://site.test/api/eventos',{method:'POST',duplex:'half',headers:{'content-type':'application/json'},body:new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('{"x":"'+'a'.repeat(400)));c.enqueue(new TextEncoder().encode('b'.repeat(400)+'"}'));c.close()}})});
 assert.equal(await catalog.readSmallJson(streamed),null);
 results.push({test:'JSON inválido, tipos e tamanho',status:'passou localmente',detail:'Corpos malformados, tipos indevidos e fluxo sem Content-Length acima de 512 bytes foram rejeitados.'});
 const attackStrings=["' OR 1=1 --", "'; DROP TABLE events;--",'<script>alert(1)</script>','<img src=x onerror=alert(1)>','javascript:alert(1)'];
 for(const code of attackStrings) assert.equal((await api.POST(request({type:'uso',code}))).status,400);
 assert.equal((await api.POST(request({type:'seguranca',code:'acesso_negado'}))).status,400);
 assert.equal((await api.POST(request({type:'uso',code:'abrir_site',comment:attackStrings[0]}))).status,204);
 assert.equal((await logs.listEvents("uso' OR 1=1 --")).rows.length,0);
 assert.ok(sqlite.prepare("SELECT name FROM sqlite_master WHERE name='events'").get());
 const stored=JSON.stringify(sqlite.prepare('SELECT * FROM events').all());
 for(const value of attackStrings) assert.ok(!stored.includes(value));
 results.push({test:'Injeção SQL e eventos maliciosos',status:'passou localmente',detail:'Valores inválidos recusados; dados extras ignorados; filtro parametrizado não altera a consulta nem apaga a tabela.'});
 let user=null,reads=0,receivedFilter;
 const admin=load('app/gestao-ntj-7f42b9c1/page.tsx',{
  'react/jsx-runtime':{jsx,jsxs},'cloudflare:workers':{env:{ADMIN_EMAIL:'owner@example.test'}},'next/headers':{headers:async()=>new Headers()},
  '../chatgpt-auth':{getChatGPTUser:async()=>user,chatGPTSignInPath:p=>'/signin-with-chatgpt?return_to='+encodeURIComponent(p),chatGPTSignOutPath:()=>'/signout-with-chatgpt'},
  '../../server/eventos.mjs':catalog,
  '../../server/logs':{allowRequest:async()=>false,writeEvent:async()=>{},listEvents:async type=>{reads++;receivedFilter=type;return {rows:[{id:1,at:Date.now(),type:'<script>alert(1)</script>',code:'<img src=x>',origin:'<img src=x onerror=alert(1)>'}],counts:[]}}},
 }).default;
 const params=[{}, {admin:'true',email:'owner@example.test',userId:'owner'}, {tipo:"seguranca' OR 1=1 --"}, {tipo:['uso','seguranca']}, {tipo:'uso',_rsc:'teste'}];
 for(const candidate of [null,{userId:'other',email:'other@example.test'}])for(const p of params){user=candidate;const html=renderToStaticMarkup(await admin({searchParams:Promise.resolve(p)}));assert.ok(!html.includes('<table'));assert.ok(html.includes('Somente a conta autorizada'));assert.equal(reads,0);}
 results.push({test:'Acesso direto e alteração de parâmetros',status:'passou localmente',detail:'Página real exercitada com dez combinações de visitante/conta e parâmetros; nenhuma consulta foi executada antes de autorizar. Identidades simuladas.'});
 user={userId:'owner',email:'owner@example.test'};
 const html=renderToStaticMarkup(await admin({searchParams:Promise.resolve({tipo:"uso' OR 1=1 --"})}));
 assert.equal(receivedFilter,'');assert.ok(!html.includes('<script>'));assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));
 user=null;const after=renderToStaticMarkup(await admin({searchParams:Promise.resolve({})}));assert.ok(!after.includes('<table'));assert.equal(reads,1);
 results.push({test:'XSS no painel e retirada da identidade',status:'passou localmente',detail:'Renderização React real escapou texto malicioso de uma linha simulada; retirada da identidade voltou a impedir a consulta. Não é replay de cookie real.'});
 // A função de login usa identidade da plataforma; teste não finge verificar a plataforma.
 let identityHeaders=new Headers();
 const auth=load('app/chatgpt-auth.ts',{'next/headers':{headers:async()=>identityHeaders},'next/navigation':{redirect:()=>{throw Error('redirect')}}});
 for(const target of ['https://evil.test','//evil.test','/\\evil.test','/callback','/signin-with-chatgpt']) assert.equal(new URL('https://site.test'+auth.chatGPTSignInPath(target)).searchParams.get('return_to'),'/');
 identityHeaders=new Headers({'oai-authenticated-user-id':'fixture','oai-authenticated-user-email':'owner@example.test'});
 assert.equal((await auth.getChatGPTUser()).email,'owner@example.test');
 results.push({test:'Falsificação de identidade na borda',status:'não validado',detail:'O helper lê cabeçalhos fornecidos pela hospedagem. Um teste local consegue injetá-los e NÃO comprova que visitantes conseguem fazê-lo em produção. A remoção/substituição pela plataforma exige teste real.'});
 const sensitive=['/.env','/.env.local','/.git/config','/server/logs.ts','/db/schema.ts','/backup.sql','/database.sqlite','/.openai/hosting.json','/drizzle/0000_abnormal_king_bedlam.sql'];
 for(const pathname of sensitive) {assert.ok(!fs.existsSync(path.join('dist/client',pathname.slice(1))));const response=await unknown.GET(new Request('https://site.test'+pathname));assert.equal(response.status,404);assert.ok(!(await response.text()).includes('CREATE TABLE'));}
 const files=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);entry.isDirectory()?walk(p):files.push(p)}}walk('dist/client');
 assert.ok(!files.some(f=>/\.(sql|sqlite|db|map|zip)$/.test(f)||f.includes('/.env')||f.includes('/.git/')));
 for(const f of files.filter(f=>/\.(js|json|html|css)$/.test(f))) assert.ok(!/(?:ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|sk-[A-Za-z0-9_-]{30,})/.test(fs.readFileSync(f,'utf8')),'Possível segredo no arquivo '+f);
 results.push({test:'Exposição de arquivos sensíveis',status:'passou no artefato/local',detail:'Nove caminhos não existem no diretório público e recebem 404 na rota local. Nenhum banco, SQL, mapa de código, ZIP ou padrão conhecido de token encontrado no artefato público; não é detector de todos os segredos.'});
 const secured=secureResponse(new Response('fixture',{headers:{Vary:'RSC'}}));
 for(const h of ['cache-control','cdn-cache-control','cloudflare-cdn-cache-control'])assert.ok(secured.headers.get(h).includes('no-store'));
 assert.ok(secured.headers.get('vary').includes('Cookie'));
 results.push({test:'Cache compartilhado',status:'passou no código',detail:'Respostas dinâmicas recebem no-store; o teste manual de saída foi relatado pelo usuário. Reutilização de cookie antigo e cache da infraestrutura não foram ensaiados.'});
 sqlite.close();
 // Verifica os fluxos públicos com dados maliciosos sem usar o catálogo como HTML livre.
 const {evaluate,node}=require('../testes.cjs');
 evaluate("DB.cpu[0].name='<img src=x onerror=alert(1)>';currentCompareType='cpu';document.getElementById('compare-left').value=DB.cpu[0].id;document.getElementById('compare-right').value=DB.cpu[1].id;runComparison()");
 assert.ok(node('compare-result-area').innerHTML.includes('&lt;img'));assert.ok(!node('compare-result-area').innerHTML.includes('<img'));
 evaluate('applyBuild({cpu:DB.cpu[0].id})');assert.ok(!node('build-summary').innerHTML.includes('<img'));
 assert.equal(evaluate("readSharedBuild('#montagem=cpu=%3Cscript%3E&budget=Infinity').parts.cpu"),'');
 results.push({test:'Conteúdo malicioso no montador e links',status:'passou localmente',detail:'Nome de catálogo adulterado escapado no comparador e resumo; identificador malicioso e orçamento inválido descartados. DOM simulado.'});
 fs.writeFileSync('resultado-ataques.json',JSON.stringify({at:new Date().toISOString(),environment:'Funções reais do projeto, React, SQLite em memória, identidade/infraestrutura simuladas',results},null,2));
 for(const row of results) console.log(row.status.toUpperCase()+': '+row.test);
})();
