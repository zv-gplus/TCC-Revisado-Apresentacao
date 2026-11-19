# NTJ Builder

Projeto de TCC para comparar peças e planejar a montagem de um computador. O comparador e o montador usam HTML, CSS e JavaScript e executam os cálculos no navegador. [Abrir o NTJ Builder no Cloudflare](https://ntj-builder.yurizovico4.workers.dev/)

A [versão criada no ChatGPT](https://ntj-builder-apresentacao-1019.civilmacaw9.chatgpt.site/) serviu de referência visual para o front-end.

## Rodar e testar

Use Node.js 24 e pnpm 11.25.0, conforme `package.json`.

```sh
pnpm install --frozen-lockfile
npm run dev
```

Abra `http://127.0.0.1:5173/`. O Wrangler serve os arquivos de `frontend/` durante o desenvolvimento. Para uma consulta rápida, também é possível abrir `frontend/index.html` no navegador.

```sh
npm test
npm run build
npm run test:artefato
npm start
```

- `npm test` roda as suítes de catálogo, comparação, montagem, compatibilidade, preços, compartilhamento, fontes e temas.
- `npm run build` recria `dist/client/` com os arquivos de `frontend/`.
- `npm run test:artefato` confere o conteúdo e os caminhos dos arquivos, além de executar verificações de HTTP e segurança na prévia local.
- `npm start` abre a prévia do artefato com Wrangler no mesmo endereço do servidor de desenvolvimento. Encerre o servidor anterior antes de iniciá-la, ou passe `-- --port 5174` para usar outra porta.

Os comandos de prévia usam uma data de compatibilidade suportada pelo runtime local do Wrangler. O arquivo `wrangler.jsonc` mantém a data de compatibilidade do Worker publicado.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `frontend/index.html` | Abas, campos de seleção e cartões do comparador e do montador. |
| `frontend/css/` e `frontend/img/` | Estilos responsivos, temas e texturas locais. |
| `frontend/dados/` | Catálogo, especificações técnicas, ofertas e referências. |
| `frontend/js/` | Comparação, montagem, validações, preços, temas e compartilhamento. |
| `scripts/` | Geração do artefato, prévia local e execução da suíte de testes. |
| `tests/` | Testes de funcionalidades, CSS, referências e conteúdo publicado. |
| `docs/` | Fontes, notas técnicas e [histórico das revisões](docs/historico/README.md). |
| `wrangler.jsonc` | Worker de destino e diretório de ativos publicado. |
| `dist/client/` | Artefato gerado. Edite os originais em `frontend/`. |

Node.js executa os scripts e testes. O pnpm instala as dependências fixadas no lockfile. O PostCSS analisa a estrutura do CSS nas verificações do tema, e o Wrangler executa a prévia e publica os ativos no Cloudflare. A geração copia o HTML, o CSS, o JavaScript e os recursos sem transformação.

## Limites dos dados

O catálogo inclui 64 peças e 24 variantes de GPU com referências. Os preços são cadastrados com loja, condição de pagamento e data de consulta. Estoque, frete e valores atuais devem ser conferidos na loja.

Os índices de desempenho, FPS e consumo são estimativas. As verificações de BIOS, dimensões e conectores dependem dos modelos e dados cadastrados. A interface marca como pendente o que ainda precisa ser conferido.

## GitHub e publicação

O site público usa o Worker `ntj-builder` no Cloudflare. O deploy é manual. Um push ao GitHub atualiza apenas o repositório.

Para preparar o upload, use o checkout da revisão aprovada. Execute as verificações acima e confirme que o Wrangler tem acesso à conta do Worker. Na raiz do repositório, envie o artefato gerado:

```sh
pnpm exec wrangler versions upload --config wrangler.jsonc
```

O upload cria uma versão no Cloudflare. Em **Workers & Pages → ntj-builder → Deployments**, selecione o ID retornado pelo Wrangler e implante a versão. Confira a página inicial, o comparador e o montador no endereço público. O histórico de deploys mantém as versões anteriores disponíveis para reversão.

O diretório enviado é `dist/client/`. Testes, documentação, relatórios e capturas ficam fora desse diretório.
