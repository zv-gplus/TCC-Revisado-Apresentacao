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
for (const name of sources) {
  const output = path.join('dist/client',name);
  assert.ok(fs.existsSync(output), name+' ausente da publicação');
  assert.ok(fs.readFileSync(output).equals(fs.readFileSync(path.join('frontend',name))), name+' desatualizado');
}
for (const oldFile of ['style.css','script.js','tema.js','dados.js','dados-validados.js']) assert.ok(!fs.existsSync(path.join('dist/client',oldFile)), 'Arquivo antigo ainda publicado: '+oldFile);
const html = fs.readFileSync('frontend/index.html','utf8');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (/^(?:https?:|#)/.test(match[1])) continue;
  assert.ok(fs.existsSync(path.join('frontend',match[1])), 'Referência inexistente: '+match[1]);
}
console.log('Publicação: '+sources.length+' arquivos conferidos, links locais válidos e caminhos antigos removidos.');
