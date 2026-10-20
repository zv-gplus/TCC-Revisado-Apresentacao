# Ofertas e preços — primeira versão

Implementado em 19/10/2026. O projeto usa um cadastro manual, sem robô de coleta, API comercial, conta de loja, afiliados ou requisições às lojas durante o uso. Todos os detalhes técnicos de compatibilidade permanecem separados do cadastro comercial.

## O que aparece no site

A peça selecionada mostra preço, condição de pagamento, loja, vendedor quando diferente da loja, modelo/SKU, data e link direto “Ver na loja”. O link abre uma nova aba com `noopener noreferrer`.

O cadastro inicial tem 13 preços consultados na Pichau para produtos do catálogo e três páginas exatas de GPU indisponíveis na consulta (KaBuM! e TerabyteShop). Modelos não pesquisados ou sem oferta confirmada aparecem com “Preço não disponível”. Uma página que redirecionou para uma categoria não foi usada como oferta. Não se afirma que é a loja mais barata nem que o estoque continua disponível. Datas de consulta não significam garantia de atualização em tempo real; páginas de pesquisa podem ter cache.

O preço de cada GPU depende da variante física. Selecionar apenas “RTX 4060” ou trocar para outra placa não reaproveita a oferta de outro modelo. As três GPUs consultadas estavam esgotadas; nenhum preço histórico delas foi somado. A página Terabyte da ASUS RTX 3060 V2 ainda mostra R$2.214,50 junto a “Produto Indisponível”; esse valor foi deliberadamente excluído.

Memórias genéricas, kits sem identificação suficiente ou produtos com revisão diferente não recebem uma oferta de outro modelo. A memória Fury Beast tem oferta de um módulo de 8GB (1x8), não de um kit de 16GB.

## Total, orçamento e compartilhamento

- A soma usa inteiros em centavos. Frete e cupons não entram no cálculo; condições Pix são mostradas explicitamente.
- Com preços faltantes, o rótulo é “Subtotal com preços disponíveis”, com quantidade de peças cotadas e faltantes.
- Se nenhuma peça selecionada tem preço, o total mostra “—”. Isso não significa que os itens custam zero.
- Com preço em todas as peças selecionadas, o rótulo é “Total das peças selecionadas”. O progresso continua indicando se faltam categorias da montagem.
- O orçamento só informa saldo restante quando todas as peças selecionadas têm cotação. Um subtotal que já excede o limite pode indicar esse excesso.
- Montagens salvas e links continuam contendo IDs e orçamento, sem aceitar preço ou URL do visitante. Ao restaurar, o site lê o cadastro atual. O resumo em texto inclui preço, loja, condição, SKU, data, endereço e preços faltantes.
- O comparador só apresenta uma diferença monetária se ambos os itens tiverem oferta confirmada. Para GPU, o modelo físico deve ser escolhido no montador.

## Como atualizar de forma simples

Edite somente `frontend/dados/ofertas.js` para adicionar ou atualizar ofertas. Pesquise a página do produto exato e confira modelo, revisão, capacidade e se é unidade ou kit. Não use valor de produto similar, open box, kit, parcela ou anúncio esgotado como preço ativo.

A chave é `tipo:id`, por exemplo `cpu:ryzen5-5500`. Para GPU use o ID da variante, por exemplo `gpu:asus-7600-dual-oc`; não use `gpu:rx7600`.

Campos:

| Campo | Exemplo / significado |
| --- | --- |
| store | Pichau, KaBuM! ou TerabyteShop |
| seller | Nome do vendedor real, inclusive em marketplace |
| product / sku | Produto exato e código da oferta |
| priceCents | 55999 significa R$559,99; `null` para indisponível |
| payment | Condição consultada, como “À vista no Pix” |
| checkedAt | Data da consulta, no formato AAAA-MM-DD |
| url | URL HTTPS direta da página, sem rastreadores, busca ou redirecionadores |
| status | `quoted` para preço consultado ou `unavailable` para indisponível |

Uma oferta `quoted` requer centavos positivos, condição e data válida. Para `unavailable`, use `priceCents: null` e `payment: null`. Para remover uma cotação que não pôde ser reconfirmada, remova a entrada ou registre a indisponibilidade observada. Sem entrada, o site continua funcionando.

As lojas permitidas estão em `STORE_HOSTS`, em `frontend/js/precos.js`. Não aceite URLs ou cotações arbitrárias por formulário ou armazenamento local. Para adicionar outra loja, revise o domínio e o formato de link direto dessa loja.

Os antigos valores ilustrativos foram removidos do catálogo. Há uma única fonte de preços usada pela interface: `frontend/dados/ofertas.js`. O arquivo `docs/ofertas-consultadas.json` guarda o registro desta pesquisa e não é lido pelo site.

## Validação

Execute `node tests/precos.cjs`, `node tests/validacoes.cjs`, `node tests/catalogo.cjs`, `node tests/tema.cjs`, `node tests/estados.cjs` e `node tests/compartilhamento.cjs`. Os testes de preço cobrem soma exata, subtotal incompleto, orçamento, troca de GPU, esgotados, links inválidos, adulteração do armazenamento e exportação. A oferta ativa de GPU usada em um teste é uma fixture temporária, não uma cotação publicada.

Os testes da interface usam DOM simulado. Não houve conferência desta mudança em navegador real nem ensaio de compra.
