# Verificação de segurança — 19/10/2026

## Alterações

- O painel saiu de `/admin` para `/gestao-ntj-7f42b9c1`. O caminho antigo não redireciona para o novo: responde como uma página inexistente.
- O endereço novo não aparece no montador público. Ele aparece no código e neste guia, portanto NÃO é uma senha nem substitui a autorização.
- A verificação da conta acontece no servidor, antes de consultar os registros.
- O Worker aplica `Cache-Control: private, no-store`, bloqueio de cache de CDN e variação por Cookie às respostas dinâmicas. Os arquivos estáticos do montador podem continuar em cache.
- Requisições em excesso são rejeitadas mais cedo por um contador em memória de cada instância. O banco mantém os limites compartilhados entre instâncias.
- A limpeza do banco deixa de ocorrer em cada envio: é agrupada por minuto por instância. A consulta autorizada força a limpeza antes de mostrar os registros.

## Como repetir os testes

Com as dependências instaladas e Node.js 24:

```
node tests/logs.cjs
node tests/seguranca-carga.cjs
```

O segundo comando testa a função real da página do painel, com dependências de identidade e banco simuladas, e as rotas de coleta usando Request/Response reais e SQLite em memória. O SQL é exercitado em transações; a rede, o D1 e o login do ChatGPT não são exercitados.

## Resultados

| Cenário | Requisições | Simultâneas | Aceitas | Limitadas (429) | Erros internos |
|---|---:|---:|---:|---:|---:|
| Uma origem de rede simulada | 1.000 | 20 | 30 | 970 | 0 |
| 50 origens simuladas | 1.000 | 20 | 300 | 700 | 0 |
| Quatro instâncias simuladas com banco compartilhado | 1.000 | 20 | 300 | 700 | 0 |

O tempo desses testes mede apenas a execução local em memória; não representa latência ou capacidade da hospedagem. Os limites são por janela fixa de minuto: podem permitir dois lotes próximos à virada do minuto.

Também passaram: bloqueio da consulta para visitante anônimo, outra conta e identidade incompleta; acesso com identidade autorizada simulada; perda de acesso ao retirar a identidade; filtros inválidos; descarte de texto livre; tamanho máximo de mensagens; limpeza por prazo e teto de registros; falha do banco; cabeçalhos do wrapper que impedem cache compartilhado. Nenhuma senha ou token de serviço é incluído no código entregue.

## Limites da verificação

A proteção automatizada da hospedagem já recusou a origem de testes com HTTP 403/código 1010. Não tentamos contornar essa proteção. Sem uma resposta do aplicativo, um 403 não comprova que a autorização do painel funcionou. Não foi enviado teste de carga à hospedagem pública.

Não foram confirmados: login real com duas contas, remoção/substituição de cabeçalhos de identidade falsificados pela infraestrutura e comportamento do cache de produção. Os cabeçalhos `oai-authenticated-user-*` são a identidade fornecida pela hospedagem; o aplicativo não valida uma assinatura própria. Os testes simulados NÃO comprovam a proteção desse limite de confiança.

A limitação implementada protege a coleta de eventos e o trabalho de registrar caminhos inválidos. Ela não bloqueia todo tráfego do site e não oferece garantia de resistência a DDoS. Uma inundação distribuída ainda pode gerar operações no banco; proteção de infraestrutura exige recursos e configuração da hospedagem.

O acesso do navegador ao painel deve ser conferido desconectado, com a conta autorizada e com uma segunda conta. Após sair, atualizar e voltar no navegador não devem revelar novos dados. A verificação da infraestrutura contra falsificação de identidade precisa ocorrer em um ambiente autorizado que alcance o aplicativo, sem desativar ou contornar a proteção de borda.
