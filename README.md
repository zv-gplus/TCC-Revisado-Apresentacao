# NTJ Builder — TCC

Comparador e montador didático de computadores, com HTML, CSS e JavaScript puro. A hospedagem também possui um pequeno servidor e banco de registros, separados da lógica de montagem. Os visitantes não precisam de cadastro.

## Acessar pelo celular

Abra https://ntj-builder-apresentacao-1019.civilmacaw9.chatgpt.site e compartilhe esse endereço com os colegas. Cada navegador mantém sua própria montagem salva. O botão “Link da montagem” permite enviar as peças escolhidas a outra pessoa. O destinatário precisa conferir as pendências: confirmações físicas não são transferidas.

A versão publicada é uma cópia. Ao editar os arquivos do ZIP, será necessário publicar novamente para atualizar o endereço.

## Rodar no computador

Descompacte o ZIP e abra `frontend/index.html` no navegador. Para servir pela rede local, com Python instalado, abra o terminal na pasta deste README e execute:

```sh
python -m http.server 8000 --directory frontend
```

No Windows também pode usar `py` no lugar de `python`. No celular conectado ao mesmo Wi-Fi, abra `http://IP-DO-COMPUTADOR:8000`. Consulte o IPv4 do computador com `ipconfig`. O computador precisa ficar ligado, o firewall deve permitir a conexão e redes escolares podem bloquear comunicação entre aparelhos. Para a apresentação, prefira o endereço público acima.

## Entender o código

- `frontend/dados.js`: catálogo e índices ilustrativos.
- `frontend/ofertas.js`: preços em centavos, loja, vendedor, link e data, cadastrados manualmente.
- `frontend/precos.js`: consulta das ofertas, validação dos links e soma dos preços confirmados.
- `frontend/dados-validados.js`: dados físicos e referências oficiais.
- `frontend/compatibilidade.js`: regras de socket, memória e estimativa de consumo.
- `frontend/validacoes.js`: verificações de BIOS, medidas e conectores.
- `frontend/interface-validacoes.js`: mostra resultados e pendências.
- `frontend/script.js`: comparação, montagem, orçamento, armazenamento local e resumo.
- `frontend/compartilhar.js`: cria e lê links com IDs de peças.
- `frontend/index.html` e `style.css`: estrutura e visual responsivo.

O fluxo principal lê as peças selecionadas, calcula os resultados e atualiza a tela. Dados recebidos de links e armazenamento são filtrados pelo catálogo. Não há servidor recebendo montagens. Os links públicos não são um meio de guardar dados pessoais.

## Limites do projeto

Preços são consultas manuais de produtos exatos, com data e condição de pagamento; não há atualização automática nem garantia de estoque. Sem oferta confirmada aparece “Preço não disponível”, e valores faltantes não entram como zero na cotação. O resumo distingue subtotal parcial de total das peças selecionadas. Frete não está incluído. Índices e FPS são ilustrativos, não benchmarks. Consulte `docs/OFERTAS-E-PRECOS.md` para manter o cadastro. BIOS só tem resultado conclusivo nos pares documentados; quando faltam dados, aparece uma pendência. Medidas e quantidade de conectores não garantem montagem completa, folgas de cabos ou desempenho térmico. Veja `docs/VALIDACAO-E-FONTES.md`.

## Testes

Com Node.js instalado:

```sh
node testes-validacoes.cjs
node testes-compartilhamento.cjs
```

A suíte cobre 320 combinações de placa/CPU/RAM, 345.600 cálculos de consumo, 378 comparações, 46 verificações focadas e 172.800 cenários adicionais. Também verifica links, dados inválidos e falhas no armazenamento. Usa DOM simulado: não substitui teste visual em navegador ou teste físico das peças.

Nesta revisão: fluxo de atualização simplificado; comparação sem métricas inventadas por recurso; dependência de ícones externos removida; total acessível no celular; detalhes avançados recolhíveis; compartilhamento de montagem; mensagens honestas quando o navegador bloqueia salvamento/limpeza; política de carregamento de recursos no HTML.


## Painel de registros

Acesse https://ntj-builder-apresentacao-1019.civilmacaw9.chatgpt.site/gestao-ntj-7f42b9c1 e entre com a mesma conta do ChatGPT que publicou este projeto. Somente essa conta foi autorizada; as outras recebem uma tela sem dados. Não existe senha embutida nos arquivos.

O painel mostra até 100 eventos recentes e filtros por uso, erro ou segurança. As contagens cobrem os registros ainda retidos. Registros expiram em 7 dias e são removidos na próxima coleta ou consulta. Existe também um teto de 10 mil registros, que pode remover os mais antigos antes desse prazo. Sem tráfego ou consulta não há rotina agendada de exclusão; registros vencidos nunca são mostrados na consulta.

Eventos de uso: abertura do site/montador, comparação solicitada, seleção alterada, salvamento e compartilhamento solicitados. São intenções informadas pelo navegador, não comprovação de que cada operação terminou. Erros são registrados por categoria, sem mensagens, URLs ou detalhes livres. Caminhos inexistentes que chegam ao aplicativo, caminhos comuns de varredura e dados de eventos inválidos geram registros no servidor. Isso não é um registro completo de todas as requisições da infraestrutura nem um detector de todos os ataques.

A coleta aceita só códigos previstos, limita o corpo a 512 bytes e usa SQL parametrizado. Há um limite de 30 envios por minuto por origem de rede e 300 por minuto no total; o limite protege a coleta de eventos, não todas as rotas do site. Pessoas no mesmo Wi-Fi podem compartilhar esse limite. O IP fornecido pela infraestrutura é usado apenas para gerar uma chave temporária com segredo do servidor; o IP em texto não é gravado no banco. As chaves expiram em dez minutos e são removidas na próxima limpeza. Eventos do navegador podem ser bloqueados, simulados ou ignorados pela opção “Não rastrear”.

Para explicar na apresentação: “O navegador envia códigos de eventos; o servidor valida e grava; o painel exige minha conta para mostrar os registros.”

### Arquivos novos

- `frontend/monitoramento.js`: envia eventos gerais e categorias de erro.
- `server/eventos.mjs`: valida códigos, tamanho de mensagem e autorização.
- `server/logs.ts`: gravação, consulta, retenção e limite de envios.
- `app/api/eventos/route.ts`: recebe os eventos.
- `app/gestao-ntj-7f42b9c1/page.tsx`: painel protegido pela autenticação da hospedagem.
- `app/[...path]/route.ts`: registra e responde aos caminhos desconhecidos.
- `db/schema.ts` e `drizzle/`: estrutura do banco e migrações.

As pastas `build`, `lib`, `scripts` e os arquivos de configuração vêm da estrutura necessária à hospedagem do servidor. O montador continua independente em `frontend/`. Abrir essa pasta localmente permite testar a montagem, mas não ativa o banco, autenticação ou painel hospedado.

### Testes e publicação

Os testes do montador continuam sem dependências. O teste do servidor requer as dependências do projeto e Node.js 24 (SQLite embutido): `node tests/logs.cjs`. Ele testa as rotas com Request/Response reais e SQLite em memória, simulando as integrações da hospedagem; não é um teste do login real.

A versão hospedada usa Vinext/Cloudflare Workers e D1, com configuração em `.openai/hosting.json`. `ADMIN_EMAIL` e `LOG_RATE_SECRET` são segredos definidos no serviço, nunca no código ou ZIP. Sem esses valores o painel não libera acesso e a coleta não grava eventos. A publicação exige sincronizar `frontend/` com `public/` usando `node scripts/sync-frontend.mjs`, compilar e aplicar as migrações pelo fluxo da hospedagem. Publicar somente `frontend/` em um serviço estático não fornece monitoramento.


## Revisão de segurança e carga

O painel mudou de endereço e as respostas dinâmicas recebem bloqueio de cache compartilhado. O caminho antigo `/admin` não leva ao painel. Veja `docs/VERIFICACAO-DE-SEGURANCA.md` para resultados, limites e como repetir os testes. Foram 3.000 requisições locais, com 20 simultâneas, sem erros internos; isso não é garantia contra DDoS em produção. O filtro em memória reduz operações de banco para envios já bloqueados, e a limpeza automática da coleta é agrupada por minuto; o painel limpa antes de consultar.

## Claro e escuro

O botão junto da marca muda o tema e salva a preferência neste navegador. Sem escolha salva, segue o tema do aparelho. A montagem fica preservada. O painel de registros segue a mesma preferência ao carregar. Veja `docs/TEMAS.md` para funcionamento, testes e limites da conferência visual. O fundo usa uma textura RGB fosca de hexágonos, inclusive no cabeçalho, estática e adaptada aos dois temas.


## Clareza dos estados

Campos vazios têm bordas tracejadas; estados de compatibilidade usam verde, vermelho e amarelo/laranja; a barra muda conforme o preenchimento das oito categorias; os totais têm destaque maior. Preencher oito categorias não elimina conflitos. Execute `node tests/estados.cjs` para testar esses comportamentos.

## Revisão de 20/10/2026

Todas as 64 peças e 24 variantes de GPU têm referência técnica visível. Fontes de tecnologia/família são identificadas quando não existe SKU exato. Esses links não comprovam os índices ilustrativos e não representam preços. As 13 cotações manuais continuam separadas, com loja, condição e data. Não há busca automática de preços.

Para executar toda a suíte, instale as dependências com o pnpm indicado no package.json e rode `npm test`. Depois de `npm run build`, rode `npm run test:artefato` para conferir os arquivos públicos e os ensaios de ataque no artefato. Os relatórios JSON gerados na raiz são temporários; o resumo desta revisão está em `docs/REVISAO-2026-10-20.md`.

As bibliotecas da interface que não eram usadas foram removidas. Arquivos de hospedagem e autenticação continuam necessários ao painel. O ZIP contém código, testes e documentação; não contém banco, registros reais, segredos, dependências instaladas ou arquivos compilados.
