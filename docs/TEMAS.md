# Modos claro e escuro

O botão ao lado da marca alterna entre claro e escuro. Em celulares estreitos ele mostra apenas o ícone, mantendo o nome acessível para leitores de tela e uma área de toque de 44 px.

Ao abrir o site, uma escolha salva em `ntj-theme` tem prioridade. Sem escolha válida, usa a preferência do aparelho. Se o sistema mudar de tema, o site acompanha enquanto não houver escolha manual. A opção continua funcionando quando o navegador bloqueia o armazenamento; nesse caso vale apenas para a visita atual. A chave da montagem é separada e não é alterada pelo controle visual.

O script `frontend/tema.js` é carregado antes do CSS, e a aparência depende de `data-theme` no elemento HTML. O arquivo de estilos contém as duas paletas. Tamanhos e estrutura são compartilhados: a troca altera somente as cores. O painel de registros também lê a preferência salva ao carregar; para mudá-la, use o botão do montador.

As cores de fundo, campos, tabelas, botões, avisos, erros, compatibilidade, indicadores, caixa de compartilhamento e barra móvel usam variáveis de tema. Textos dos estados continuam presentes; a informação não depende somente das cores.

## Verificação

Execute `node tests/tema.cjs` com as dependências instaladas. Os testes verificam:

- Oito combinações de preferência salva e preferência do sistema.
- Armazenamento bloqueado, valor inválido, inicialização antes da página e ausência de botão ou API de preferência.
- 40 pares de texto/fundo das paletas principais com contraste mínimo de 4,5:1 e contraste das bordas dos campos de pelo menos 3:1.
- Troca real do botão com o montador inicializado em DOM simulado, preservando peças, orçamento, resumo, link e verificações de compatibilidade. O comparador também é exercitado.

Os testes anteriores de montagem, validação, compartilhamento e segurança continuam passando. A análise de contraste é sobre as cores declaradas; não é uma auditoria completa de acessibilidade. Não houve conferência visual em navegador nesta revisão: o recurso de navegador exigido pelo ambiente não está disponível. Assim, comportamento de campos nativos e aparência final no celular ainda precisam de conferência visual.

## Fundo RGB

Textura aprovada e aplicada com quadrados entrelaçados de contorno fino em vermelho, verde e azul, desenhados no arquivo local `frontend/textura-rgb.svg`. O CSS repete o SVG como uma camada decorativa fixa atrás do conteúdo, sem animação, sem JavaScript e sem capturar cliques. A opacidade é adaptada aos dois temas e reduzida no celular; uma máscara suaviza a textura no centro. Cartões, campos e a barra móvel permanecem opacos. O efeito não é impresso.

O SVG contém quadrados e máscaras locais que alternam os cruzamentos para criar o entrelaçamento; não carrega scripts, fontes ou recursos externos. A conferência visual em navegador continua pendente.


## Estados visuais da montagem

Os resultados de compatibilidade usam verde suave para ausência de conflito, vermelho destacado para incompatibilidade e amarelo/laranja para pendências. A legenda usa as mesmas cores, mantendo os rótulos escritos. O aviso geral e os campos com conflitos confirmados acompanham o vermelho.

Campos sem peças ficam com borda tracejada e fundo secundário opaco, tanto no montador quanto no comparador. Ao escolher uma peça, voltam ao cartão sólido. Limpar ou carregar uma montagem atualiza esses estados.

O progresso fica cinza de 0 a 3 categorias, amarelo de 4 a 7 e verde em 8/8. Ele mede categorias preenchidas, não validação de compatibilidade. A descrição acessível informa essa diferença; os avisos de conflito permanecem visíveis e continuam bloqueando a simulação quando necessário.

O total tem tipografia maior e peso 800 na visão geral e na última linha do resumo. Os totais da visão geral e da barra móvel continuam sincronizados.

Execute também `node tests/estados.cjs` para conferir as etapas do progresso, estados vazios/selecionados, totais e uma montagem completa com conflito. A conferência visual em navegador continua pendente.


## Fundo hexagonal fosco — 20/10/2026

As referências mostram placas hexagonais e segmentos RGB nas bordas. A versão atual usa dois SVGs locais: textura-rgb.svg para o escuro e textura-rgb-claro.svg para o claro. O efeito é estático, com brilho curto e cores dessaturadas. Não há vídeo, biblioteca adicional ou recurso externo. A camada ignora cliques e fica atrás do conteúdo; os cards permanecem opacos. O centro recebe uma máscara mais discreta.

Execute node tests/fundo.cjs para conferir os dois arquivos e 96 combinações conservadoras de contraste sobre placa, luz e brilho. Montador, catálogo, ofertas, estados e compartilhamento também passaram com DOM simulado. O navegador não ficou disponível para conferência visual nesta rodada.
