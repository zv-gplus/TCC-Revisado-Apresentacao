# NTJ Builder

Projeto de TCC para comparar peças e montar um computador. A montagem usa HTML, CSS e JavaScript puro. O servidor cuida apenas dos registros de uso e do painel protegido.

## Abrir e testar o montador

Abra frontend/index.html no navegador. O catálogo e a montagem funcionam sem instalar dependências. Para servir pela rede local, com Python instalado, execute na raiz:

```sh
python -m http.server 8000 --directory frontend
```

No celular conectado ao mesmo Wi-Fi, use http://IP-DO-COMPUTADOR:8000. O computador precisa permanecer ligado e permitir essa conexão no firewall. Para a apresentação, use o [site público](https://ntj-builder-apresentacao-1019.civilmacaw9.chatgpt.site).

## Onde fica cada coisa

| Pasta | Conteúdo |
| --- | --- |
| frontend/ | Site que o visitante utiliza; comece por index.html. |
| frontend/dados/ | Catálogo, ofertas, dimensões, BIOS e referências. |
| frontend/js/ | Lógica separada por função. |
| frontend/css/ | Cores, temas, disposição dos elementos e versão mobile. |
| frontend/img/ | Texturas RGB locais. |
| src/app/ | Rotas do servidor e página do painel. |
| src/server/ | Validação dos eventos, limites, registros e respostas seguras. |
| src/db/ | Estrutura do banco. |
| src/lib/ | Integração necessária da plataforma de hospedagem. |
| tests/ | Testes do montador, segurança, temas e publicação. |
| docs/ | Fontes consultadas, revisões e explicações complementares. |
| scripts/ | Comandos de testes, compilação e sincronização. |
| build/ | Integração do compilador com a hospedagem. Não é o código visual. |
| drizzle/ | Migrações que criam as tabelas do banco. |

Os arquivos de configuração da raiz são necessários à compilação e publicação. public/ e dist/ são geradas automaticamente e não fazem parte do ZIP. Não edite essas cópias geradas.

## Por onde começar a entender o código

1. frontend/index.html: campos, abas e cartões.
2. frontend/dados/catalogo.js: peças e índices ilustrativos.
3. frontend/js/iniciar.js: conecta os eventos aos controles.
4. frontend/js/comparador.js: comparação entre duas peças.
5. frontend/js/montador.js: seleção, orçamento, salvamento e resumo.
6. frontend/js/compatibilidade.js e validacoes.js: regras de compatibilidade.
7. frontend/js/precos.js: preços e links de referência, sem busca automática.
8. frontend/css/style.css: aparência, tema claro/escuro e adaptação ao celular.

As funções comuns ficam em utilitarios.js. Compartilhamento, tema e monitoramento têm arquivos próprios. O HTML carrega os dados antes das funções e inicia o aplicativo por último.

## Testes e compilação

Use Node.js 24 e a versão do pnpm indicada no package.json. Depois de instalar as dependências com pnpm install, execute:

```sh
npm test
npm run build
npm run test:artefato
```

O primeiro comando testa montagem, preços, fontes, compartilhamento, temas, validações e registros. Os testes do artefato verificam todos os arquivos públicos e ensaios de ataque depois da compilação. Relatórios resultado-*.json são temporários e não entram no Git.

São 320 combinações de placa/CPU/RAM, 345.600 cálculos de consumo, 378 comparações, 46 verificações focadas e 172.800 cenários adicionais. Isso usa DOM simulado e não equivale a teste físico das peças ou conferência visual em navegador.

## Painel e segurança

O [painel de registros](https://ntj-builder-apresentacao-1019.civilmacaw9.chatgpt.site/gestao-ntj-7f42b9c1) exige a conta ChatGPT autorizada. O endereço do painel não substitui essa autorização. Abrir frontend/index.html localmente não ativa o painel, autenticação ou banco.

ADMIN_EMAIL e LOG_RATE_SECRET são segredos da hospedagem e não estão no ZIP. Sem configuração válida o acesso não é liberado. O servidor verifica origem, tamanho e códigos dos eventos; usa SQL parametrizado e limites de coleta. A limitação protege o endpoint de eventos, não toda a infraestrutura contra DDoS.

Os registros contêm categorias gerais de uso, erro e segurança, sem nomes, montagens ou IP em texto. Expiram em até sete dias, com teto de dez mil eventos. A limpeza ocorre na próxima coleta/consulta; eventos vencidos não são mostrados. O IP da infraestrutura só gera uma chave temporária com segredo do servidor. Eventos enviados pelo navegador podem ser bloqueados ou simulados e respeitam a opção Não rastrear.

## Limites dos dados

Todas as 64 peças e 24 variantes de GPU têm referências. Itens sem SKU exato identificam a fonte como família/tecnologia. Os 13 preços disponíveis são consultas manuais, com loja, pagamento e data; três anúncios foram registrados como indisponíveis. Não há atualização automática, garantia de estoque ou frete incluído. Preços ausentes não são tratados como peças gratuitas.

Índices e FPS são ilustrativos. BIOS, medidas e conectores dependem dos modelos e dados cadastrados. As verificações mantêm pendente o que não foi confirmado e não garantem folgas de cabos, térmica ou montagem física completa.

A troca de tema preserva a montagem e o orçamento. A textura RGB fosca usa SVGs locais, sem animação ou serviços externos.

## GitHub e publicação

O repositório guarda o código e seu histórico. Commit e Sync Changes enviam as alterações ao GitHub; isso não atualiza automaticamente o site publicado. A hospedagem atual usa Vinext, Cloudflare Workers e D1, com identidade declarada em .openai/hosting.json. O build copia frontend/ para public/ antes de compilar. Publicar somente o frontend em hospedagem estática não ativa os logs nem o painel.

Veja docs/ORGANIZACAO.md para a reorganização e docs/REVISAO-2026-10-20.md para a auditoria de segurança anterior e seus limites.
