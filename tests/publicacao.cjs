const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
function files(directory, prefix = '') {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const relative = path.join(prefix, entry.name);
    return entry.isDirectory() ? files(path.join(directory,entry.name),relative) : [relative];
  });
}
const sources = files('frontend');
process.env.WRANGLER_WRITE_LOGS = 'false';
process.env.WRANGLER_SEND_METRICS = 'false';
const { unstable_readConfig } = require('wrangler');
const assets = unstable_readConfig({config: 'wrangler.jsonc'}).assets.directory;
assert.deepEqual(files(assets).sort(), [...sources].sort(), 'O artefato deve conter apenas o conteúdo de frontend/');
for (const name of sources) {
  const output = path.join(assets,name);
  assert.ok(fs.existsSync(output), name+' ausente da publicação');
  assert.ok(fs.readFileSync(output).equals(fs.readFileSync(path.join('frontend',name))), name+' desatualizado');
}
for (const oldFile of ['style.css','script.js','tema.js','dados.js','dados-validados.js','js/monitoramento.js']) assert.ok(!fs.existsSync(path.join(assets,oldFile)), 'Arquivo antigo ainda publicado: '+oldFile);
const html = fs.readFileSync('frontend/index.html','utf8');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (/^(?:https?:|#)/.test(match[1])) continue;
  assert.ok(fs.existsSync(path.join('frontend',match[1])), 'Referência inexistente: '+match[1]);
}
for (const name of sources.filter(name => name.endsWith('.css'))) {
  const css = fs.readFileSync(path.join('frontend',name),'utf8');
  for (const match of css.matchAll(/url\(\s*["']?([^"'\s)]+)/g)) {
    const url = match[1];
    if (/^(?:https?:|data:|#)/.test(url)) continue;
    const target = path.normalize(path.join(path.dirname(name),url));
    assert.ok(sources.includes(target), 'Referência CSS inexistente: '+url);
  }
}
console.log('Publicação: '+sources.length+' arquivos conferidos, links locais válidos e caminhos antigos removidos.');
