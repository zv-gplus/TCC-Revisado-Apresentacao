const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
// O build precisa levar todos os arquivos públicos, não só o HTML.
for (const name of fs.readdirSync('frontend')) {
  const output = path.join('dist/client', name);
  assert.ok(fs.existsSync(output), name+' ausente da publicação');
  assert.ok(fs.readFileSync(output).equals(fs.readFileSync(path.join('frontend', name))), name+' desatualizado na publicação');
}
console.log('Publicação: HTML, CSS, scripts e imagens incluídos e iguais ao código revisado.');
