# Revisão geral — 19/10/2026

## Correções

- Ícone da aba incluído em SVG e ICO. A amostra de registros da hospedagem mostrava acessos a `/favicon.ico` com 404.
- Abrir outro link de montagem mudando somente o fragmento do endereço agora atualiza as peças e o orçamento. Âncoras comuns não alteram a seleção.
- Links de montagem deixam de encaminhar parâmetros extras da URL atual.
- Função visual sem uso removida. A exportação reaproveita os nomes de categorias já declarados, sem uma segunda lista.
- O DOM simulado dos testes passou a sincronizar `className` e `classList`, deixando a verificação de estados mais fiel.

## Conferências realizadas

Todos passaram: sintaxe de JavaScript; tipagem TypeScript; unicidade dos IDs do HTML; existência dos elementos referenciados e recursos locais; ausência de eventos inline; validações de catálogo, consumo, comparação, BIOS, medidas e conectores; compartilhamento, armazenamento bloqueado e dados inválidos; claro/escuro e contrastes; progresso, campos vazios e totais; registros, autorização simulada, retenção, limitação e carga local.

A suíte principal cobre 320 trios de placa/CPU/RAM, 345.600 cálculos de consumo, 378 comparações, 46 verificações focadas e 19.200 cenários adicionais. O teste de carga local cobre 3.000 requisições com 20 simultâneas. As verificações não são testes de bancada nem benchmarks de hardware.

Na amostra consultada dos registros da hospedagem, a coleta recebeu respostas HTTP 204. As ocorrências de erro retornadas eram requisições ao ícone ausente. Isso confirma somente os eventos observados, não a ausência de todos os erros ou ataques.

## Limites preservados

A interface e a autenticação não foram conferidas em navegador real nesta revisão. Identidades de dono, outra conta e visitante desconectado foram simuladas nos testes da página. Ainda não foram confirmadas em produção a proteção contra falsificação da identidade fornecida pela plataforma, o cache efetivo e a resistência a DDoS. O painel continua exigindo autorização no servidor, com consulta posterior a essa verificação.

Os registros do banco da aplicação não guardam IP em texto, nomes ou montagens completas. A infraestrutura possui registros próprios de acesso, que podem conter metadados de rede; eles não são a tabela exibida pelo painel e têm controles próprios da plataforma.

Não foram alteradas as regras de catálogo, o visual aprovado ou a estrutura de autenticação.
