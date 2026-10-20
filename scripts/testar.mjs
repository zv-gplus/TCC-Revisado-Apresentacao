import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const tests = ['testes-validacoes.cjs','testes-compartilhamento.cjs','tests/catalogo.cjs','tests/precos.cjs','tests/fontes.cjs','tests/estados.cjs','tests/tema.cjs','tests/fundo.cjs','tests/logs.cjs','tests/seguranca-carga.cjs'];
for (const test of tests) {
  const result = spawnSync(process.execPath, [test], {cwd: root, encoding: 'utf8', windowsHide: true});
  if (result.status !== 0) { console.error(result.stdout, result.stderr, result.error || ''); process.exit(1); }
  console.log('OK: '+test);
}
console.log('Todos os testes passaram. O navegador e a infraestrutura real exigem conferência separada.');
