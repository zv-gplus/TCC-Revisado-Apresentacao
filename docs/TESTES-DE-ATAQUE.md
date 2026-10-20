# Ensaios de segurança — 19/10/2026

Resultado: os cenários executados na aplicação e no artefato passaram. Isso não representa validação total da segurança nem confirmação de todos os controles da hospedagem.

## Resultado por cenário

| Cenário | Resultado e alcance |
|---|---|
| Acesso direto ao painel sem autorização | Passou localmente: função real da página, com identidade simulada, sem consulta ao banco antes da autorização. Usuário também forneceu evidência manual de acesso autorizado e de tela restrita. |
| Alteração de parâmetros e filtros | Passou localmente: dez combinações de identidade e parâmetros não liberaram dados; filtro inválido da conta autorizada foi descartado. |
| Conteúdo malicioso / XSS | Passou nos exemplos ensaiados: eventos fora da lista recusados; React escapou linha maliciosa simulada; comparador e resumo escaparam nome adulterado. Parte do navegador usa DOM simulado. Não foi executado navegador real nem uma coleção exaustiva de payloads. |
| Manipulação de consultas SQL | Passou com SQLite em memória: payloads de eventos recusados; valores extras não armazenados; filtro parametrizado não modificou o SQL e a tabela permaneceu intacta. |
| JSON inválido e mensagens grandes | Passou localmente: JSON malformado, tipos indevidos e fluxo sem Content-Length acima de 512 bytes recusados. |
| Requisições simultâneas | Passou localmente: 3.000 requisições, 20 simultâneas, sem 503; limites retornaram 429. Não mede a capacidade ou proteção contra DDoS da hospedagem. |
| Sessão depois de sair | Usuário relatou que os registros não apareceram ao sair, voltar e atualizar. A retirada da identidade também bloqueou a consulta local. Não houve captura/reenvio de cookie antigo; invalidação de um token roubado não foi ensaiada. |
| Arquivos sensíveis | Passou no artefato/local: nove caminhos de ambiente, Git, banco e servidor ausentes da pasta pública e recusados pela rota local com 404. Nenhum banco, SQL, ZIP, source map ou padrão conhecido de token encontrado nos arquivos públicos. Esse detector não identifica todo tipo de segredo. |
| Pedidos de outro site / CORS | Passou na rota local: quatro origens não autorizadas receberam 403, sem cabeçalho de liberação de leitura. Preflight e cabeçalhos acrescentados pela infraestrutura não foram testados em produção. |
| Falsificação de identidade | Não validada na infraestrutura. O código confia nos cabeçalhos fornecidos pela hospedagem. Injetá-los no helper local apenas demonstra essa dependência; NÃO demonstra um ataque público nem comprova que a plataforma os remove/substitui corretamente. |

## Amostra de carga local

| Cenário | Requisições | Simultâneas | Aceitas | Limitadas | Erros internos |
|---|---:|---:|---:|---:|---:|
| Uma origem simulada | 1.000 | 20 | 30 | 970 | 0 |
| 50 origens simuladas | 1.000 | 20 | 300 | 700 | 0 |
| Quatro instâncias simuladas | 1.000 | 20 | 300 | 700 | 0 |

## Sondagem pública

Foi feita uma requisição inicial à raiz do Site. A hospedagem respondeu HTTP 403, código 1010, antes de alcançar o aplicativo. A sondagem foi interrompida. Não foram enviados os demais casos nem carga ao Site público; não houve tentativa de contornar o bloqueio.

Assim, ficam inconclusivos os ensaios automatizados em produção de exposição de arquivos, variantes do endereço do painel, filtros, origem e falsificação de identidade. Não se deve usar esse 403 como evidência de que a aplicação bloqueou cada ataque.

O usuário forneceu prints de conta autorizada visualizando a tabela e de tela restrita, além de relatar bloqueio para outra conta e após sair. Isso apoia o funcionamento básico nos cenários manuais relatados; não substitui testes do gateway, cache compartilhado, reenvio de cookie ou tentativas diferentes.

## Repetir

Com Node.js 24 e as dependências do projeto instaladas:

```sh
node tests/ataques.cjs
node tests/seguranca-carga.cjs
```

O primeiro usa funções reais do aplicativo, React e SQLite em memória. Identidade e infraestrutura são simuladas. O segundo é carga local, sem rede.

`python tests/http-publico.py` faz no máximo dez sondagens leves, somente no endereço fixo deste projeto, e interrompe diante do bloqueio de borda. Não altera identidade nem envia carga. Execute somente para este Site autorizado.

Arquivos de resultados: `resultado-ataques.json`, `resultado-seguranca.json` e `resultado-http-publico.json` acompanham a entrega. Nenhum registro de visitante, senha, cookie ou token real foi incluído.

Não houve mudança nas regras de montagem, permissões ou autenticação durante estes ensaios.
