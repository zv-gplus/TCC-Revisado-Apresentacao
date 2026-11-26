# Ofertas, preços e preparação para publicação

Implementado em 19/10/2026. O projeto usa um cadastro manual, sem robô de coleta, API comercial, conta de loja, afiliados ou requisições às lojas durante o uso. Todos os detalhes técnicos de compatibilidade permanecem separados do cadastro comercial.

## O que aparece no site

A peça selecionada mostra preço, condição de pagamento, loja, vendedor, modelo/SKU, data e link direto “Ver na loja”. O link abre uma nova aba com `noopener noreferrer`.

Em 19/10/2026, o cadastro inicial tinha 13 preços consultados na Pichau para produtos do catálogo e três páginas exatas de GPU indisponíveis na consulta (KaBuM! e TerabyteShop). Naquele cadastro, modelos sem oferta confirmada apareciam com “Preço não disponível”. Uma página que redirecionou para uma categoria não foi usada como oferta. Não se afirma que é a loja mais barata nem que o estoque continua disponível. Datas de consulta não significam garantia de atualização em tempo real; páginas de pesquisa podem ter cache.

O preço de cada GPU depende da variante física. Selecionar apenas “RTX 4060” ou trocar para outra placa não reaproveita a oferta de outro modelo. Os preços de GPUs esgotadas ficam fora da soma. A ASUS RTX 3060 V2 passou a exibir uma referência documentada da revisão V2.

Memórias genéricas, kits sem identificação suficiente ou produtos com revisão diferente não recebem uma oferta de outro modelo. A memória Fury Beast tem oferta de um módulo de 8GB (1x8), não de um kit de 16GB.

## Total, orçamento e compartilhamento

- A soma usa inteiros em centavos. Frete e cupons não entram no cálculo; condições Pix são mostradas explicitamente.
- Com ofertas atuais faltantes, o rótulo é “Subtotal com preços disponíveis”, com a cobertura da cotação.
- Se nenhuma peça selecionada tem oferta atual, o total mostra “—”.
- Com oferta atual para todas as peças selecionadas, o rótulo é “Total com ofertas atuais”. O progresso continua indicando se faltam categorias da montagem.
- Quando existe uma referência para alguma peça selecionada, aparece uma estimativa separada com cobertura e valores consultados.
- O orçamento só informa saldo restante quando todas as peças selecionadas têm cotação. Um subtotal que já excede o limite pode indicar esse excesso.
- Montagens salvas e links aceitam IDs conhecidos e orçamento positivo de até R$ 1.000.000,00, com precisão de centavos. O link preserva a variante física da GPU quando ela pertence ao chip selecionado. Ao restaurar, o site lê o cadastro atual.
- O resumo em texto inclui preço consultado, loja, condição, SKU, data, endereço, quantidade de preços faltantes e orçamento, quando válido. Mostra saldo com todos os preços presentes ou excesso quando o próprio subtotal já ultrapassa o orçamento.
- O comparador só apresenta uma diferença monetária se ambos os itens tiverem oferta confirmada. Para cotar uma GPU, selecione seu modelo físico no comparador ou no montador.

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

Os antigos valores ilustrativos foram removidos do catálogo. Há uma única fonte de preços usada pela interface: `frontend/dados/ofertas.js`. O [registro de consultas](ofertas-consultadas.json) preserva os resultados de outubro e as observações de novembro. O site usa o cadastro ativo em `frontend/dados/ofertas.js`.

## Validação

Execute `node tests/precos.cjs`, `node tests/validacoes.cjs`, `node tests/catalogo.cjs`, `node tests/tema.cjs`, `node tests/estados.cjs` e `node tests/compartilhamento.cjs`. Os testes de preço cobrem soma exata, subtotal incompleto, orçamento, troca de GPU, esgotados, links inválidos, adulteração do armazenamento e exportação. A oferta ativa de GPU usada em um teste é uma fixture temporária, não uma cotação publicada.

As suítes automatizadas usam DOM simulado. O relatório abaixo registra também a conferência em Chromium do artefato de novembro.

## Relatório de atualização de 26/11/2026

A pesquisa começou pelas montagens AM4 e AM5 e avançou para as 76 entradas do inventário das Etapas 2 a 4. Cada cotação cadastrada exige modelo e SKU compatíveis com o catálogo, preço Pix exibido na página, vendedor identificado e indicação de estoque. A disponibilidade foi observada nas páginas das lojas na data da consulta. Frete, estoque por CEP e conclusão de compra ficaram fora da verificação.

Foram consultadas 246 páginas candidatas para 75 entradas. A busca nas três lojas pela Aerocool Lux 550 W ficou sem página direta. Das 76 entradas pesquisadas, **14 tiveram preço confirmado**, incluindo **8 novos preços** e **6 revalidações**. Os preços antigos de sete itens agora esgotados saíram dos cálculos. As 62 entradas restantes estão sem preço confirmado. [Histórico e evidências por produto](ofertas-consultadas.json)

| Produto e SKU | Preço à vista no Pix | Loja e vendedor |
| --- | ---: | --- |
| ASUS TUF Gaming B550M-Plus · `TUF-GAMING-B550M-PLUS` | R$ 759,99 | [Pichau](https://www.pichau.com.br/placa-mae-asus-tuf-gaming-b550m-plus-ddr4-socket-am4-chipset-amd-b550-tuf-gaming-b550m-plus) |
| MSI A520M-A Pro · `A520M-A-PRO` | R$ 357,99 | [Pichau](https://www.pichau.com.br/placa-mae-msi-a520m-a-pro-ddr4-socket-am4-chipset-amd-a520) |
| Intel Core i9-14900K · `BX8071514900K` | R$ 2.699,99 | [Pichau](https://www.pichau.com.br/processador-intel-core-i9-14900k-24-core-32-threads-3-2ghz-6-0ghz-turbo-cache-36mb-lga1700-bx8071514900k) |
| AMD Ryzen 7 7700X · `100-100000591WOF` | R$ 1.899,99 | [Pichau](https://www.pichau.com.br/processador-amd-ryzen-7-7700x-8-core-16-threads-4-5ghz-5-4ghz-turbo-cache-40mb-am5-100-100000591wof) |
| AMD Ryzen 5 7600X · `100-100000593WOF` | R$ 1.089,99 | [Pichau](https://www.pichau.com.br/processador-amd-ryzen-5-7600x-6-core-12-threads-4-7ghz-5-3ghz-turbo-cache-38mb-am5-100-100000593wof) |
| AMD Ryzen 5 5500 · `100-100000457BOX` | R$ 499,99 | [Pichau](https://www.pichau.com.br/processador-amd-ryzen-5-5500-6-core-12-threads-3-6ghz-4-2ghz-turbo-cache-19mb-am4-100-100000457box) |
| Intel Core i3-12100F · `BX8071512100F` | R$ 549,99 | [KaBuM!](https://www.kabum.com.br/produto/283719/processador-intel-core-i3-12100f-3-3ghz-4-3ghz-max-turbo-cache-12mb-4-nucleos-8-threads-lga-1700-sem-video-integrado-bx8071512100f) |
| 16GB (1x16GB) DDR4 3200MHz CL16 XPG Spectrix D35G · `AX4U320016G16A-SBKD35G` | R$ 1.214,99 | [KaBuM! / TERABYTE](https://www.kabum.com.br/produto/495636/memoria-xpg-spectrix-d35g-rgb-16gb-1x16gb-3200mhz-ddr4-preto) |
| Samsung 990 Pro 2TB NVMe · `MZ-V9P2T0B-AM` | R$ 4.669,99 | [Pichau](https://www.pichau.com.br/ssd-samsung-990-pro-2tb-m-2-2280-pcie-nvme-leitura-7450mb-s-gravacao-6900mb-s-mz-v9p2t0b-am) |
| Kingston A400 960GB SATA · `SA400S37/960G` | R$ 928,62 | [KaBuM! / Kometa](https://www.kabum.com.br/produto/158858/ssd-kingston-a400-960gb-2-5-sata-3-leitura-500mb-s-e-gravacao-450mb-s-sa400s37-960g) |
| Crucial BX500 1TB SATA III · `CT1000BX500SSD1` | R$ 959,99 | [Pichau](https://www.pichau.com.br/ssd-crucial-bx500-1tb-2-5-sata-iii-6gb-s-leitura-540mb-s-gravac-o-500mb-s-ct1000bx500ssd1) |
| Adata SU650 480GB SATA III · `ASU650SS-480GT-R` | R$ 579,99 | [Pichau](https://www.pichau.com.br/ssd-adata-ultimate-su650-480gb-2-5-3d-nand-sata-iii-leitura-520mb-s-gravacao-450mb-s-asu650ss-480gt-r) |
| MSI MAG A550BN 550W · `MAGA550BNL` | R$ 278,10 | [KaBuM! / LOGIN INFORMATICA](https://www.kabum.com.br/produto/957356/fonte-gamer-msi-mag-a550bn-550w-80-plus-bronze-pfc-ativo-c-cabo-preto-mag-a550bn-l) |
| Cooler Master MasterBox Q300L (MCB-Q300L-KANN-S00) · `MCB-Q300L-KANN-S00` | R$ 898,00 | [KaBuM! / INFOTEC INFO](https://www.kabum.com.br/produto/230166/gabinete-masterbox-q300l-cooler-master-mcb-q300l-kann-s00) |

### Entradas sem preço confirmado

- **Placas-mãe (3)** — ASUS ROG Strix Z790-E Gaming WiFi, MSI B650 Tomahawk WiFi, ASRock B660M Phantom Gaming 4.
- **Processadores (3)** — AMD Ryzen 9 7950X, Intel Core i7-13700K, Intel Core i5-13600K.
- **Memórias RAM (7)** — 32GB DDR5 6000MHz, 16GB DDR5 5600MHz, 32GB DDR4 3600MHz, 16GB DDR4 3200MHz, 64GB (2x32GB) DDR5 6000MHz CL30 Corsair Vengeance, 8GB (1x8GB) DDR4 3200MHz CL16 Kingston Fury Beast, 16GB (2x8GB) DDR4 3200MHz CL16 XPG Gammix D10.
- **Armazenamento (5)** — WD Black SN850X 1TB NVMe, Seagate Barracuda 2TB HD, Kingston KC3000 2TB NVMe M.2, Crucial P3 Plus 1TB NVMe M.2, Kingston NV2 500GB NVMe M.2.
- **Fontes (9)** — Corsair RM1000x (1000W), EVGA SuperNOVA 850W, Cooler Master MWE 750W, Seasonic Focus GX-650, Aerocool Lux 550W, MSI MAG A750GL 750W, Corsair CV650 650W, Mancer Thunder 500W, Galax Omega GL500S 500W.
- **Gabinetes (5)** — Corsair 4000D Airflow (CC-9011200-WW), DeepCool CH370, DeepCool CC560, DeepCool CC560 V2, DeepCool CH560.
- **Coolers (6)** — DeepCool AK400, DeepCool AK620, DeepCool AG400, DeepCool AG500 BK ARGB, DeepCool AG620 (R-AG620-BKNNMN-G-1), DeepCool AK500 Zero Dark.
- **Placas de vídeo (24)** — MSI RTX 4060 Ventus 2X Black 8G OC, NVIDIA RTX 4090 Founders Edition, Sapphire Pulse RX 7900 XTX 24GB, Sapphire Pulse RX 7800 XT 16GB, Sapphire Pulse RX 7700 XT 12GB, Sapphire Pulse RX 7600 8GB, Sapphire Pulse RX 6600 8GB, Sapphire Pulse RX 580 8GB, MSI RTX 4070 Ti Ventus 3X 12G OC, MSI RTX 4070 Ti Super 16G Ventus 3X OC, MSI RTX 4060 Ti Ventus 2X Black 8G OC, MSI RTX 3060 Ventus 2X 12G OC, ASUS TUF Gaming RX 7900 XTX OC 24GB, ASUS TUF Gaming RX 7800 XT OC 16GB, ASUS Dual RX 7700 XT OC 12GB, ASUS Dual RX 7600 OC 8GB, ASUS Dual RX 6600 8GB, MSI RX 580 Armor 8G OC, ASUS TUF Gaming RTX 4090 OC 24GB, ASUS TUF Gaming RTX 4070 Ti OC 12GB, ASUS TUF Gaming RTX 4070 Ti Super OC 16GB, ASUS Dual RTX 4060 OC 8GB, ASUS Dual RTX 4060 Ti OC 8GB, ASUS Dual RTX 3060 V2 OC 12GB.

### Montagens de demonstração

| Montagem | Resultado local | Componentes sem preço confirmado |
| --- | --- | --- |
| AM4 | 4 de 8, subtotal de R$ 2.436,08. Estimativa de 251 W | RX 6600 Sapphire Pulse ou ASUS Dual do catálogo, memória genérica DDR4 2×8 GB 3200 CL22, Kingston NV2 500 GB e DeepCool AK400 |
| AM5 | 1 de 8, subtotal de R$ 1.089,99. Estimativa de 283 W | MSI MAG B650 Tomahawk WiFi, RTX 4060 do catálogo, memória genérica DDR5 2×16 GB 6000 CL36, Crucial P3 Plus 1 TB, Corsair CV650, Corsair 4000D Airflow e DeepCool AK620 |

Na AM4, o Q300L foi incluído a R$ 898,00, vendido por INFOTEC INFO na KaBuM!. O Ryzen 5 5500 e a TUF B550M-Plus tiveram o preço reconfirmado. O anúncio da fonte MAGA550BNL foi confirmado no marketplace da KaBuM!. Na AM5, o preço do Ryzen 5 7600X foi reconfirmado. Os valores históricos da B650 Tomahawk e dos coolers esgotados saíram do subtotal.

### Divergências de modelo e revisão

- **ASUS RTX 3060.** O SKU `90YV0GB2-M0NA10` identifica a `DUAL-RTX3060-O12G-V2`, que é a variante cadastrada. O SKU `90YV0GB2-M0NA00` aparece associado à `DUAL-RTX3060-O12G` original. São revisões comerciais distintas, com dimensões e conector de energia iguais nas fichas comparadas. A TerabyteShop exibe V2/LHR e M0NA10 no conteúdo, mantém M0NA00 no endereço e informa indisponibilidade. O valor de R$ 2.214,50 permaneceu no registro histórico, fora do cadastro ativo. [Ficha ASUS original](https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx3060-o12g/techspec/) · [Loja oficial ASUS V2 com part number](https://webshop.asus.com/de-de/products/asus-dual-rtx3060-o12g-v2-12gb-gddr6-hdmi-dp) · [Anúncio da TerabyteShop](https://www.terabyteshop.com.br/produto/17268/placa-de-video-asus-geforce-rtx-3060-12gb-gddr6-192bit-90yv0gb2-m0na00)
- **Corsair CV650.** A página regional identificada como `CP-9020211-EU` usa `CP-9020236` na tabela elétrica. O anúncio brasileiro de `CP-9020211-BR` estava esgotado. A revisão e a ficha de cabos para a unidade brasileira permanecem pendentes. [Corsair](https://www.corsair.com/eu/en/p/psu/cp-9020211-eu/cv-series-cv650-650-watt-80-plus-bronze-certified-psu-cp-9020211-eu) · [TerabyteShop](https://www.terabyteshop.com.br/produto/13509/fonte-corsair-cv650-650w-80-plus-bronze-cp-9020211-br)
- **Outras variantes.** Anúncios de RTX 4060 Dual EVO, RX 6600 Dual V2/V3, AK620 Zero Dark, Cooler Master MWE Gold e DeepCool CH560 Digital branco apareceram nas buscas por peças de outra revisão, acabamento ou certificação. As observações foram mantidas por URL no registro de pesquisa.

### Especificações conferidas

| Peças | Conferência |
| --- | --- |
| Ryzen 5 5500 e ASUS TUF B550M-Plus | AM4, DDR4 e BIOS mínima 2423 para o 5500. A placa é Micro-ATX e a ficha lista ATX de 24 pinos e alimentação de CPU de 8 pinos. [AMD](https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5500.html) · [ASUS, CPUs e BIOS](https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b550m-plus/helpdesk_cpu?model2Name=TUF-GAMING-B550M-PLUS) · [ASUS, ficha](https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b550m-plus/techspec/) |
| Ryzen 5 7600X e MSI MAG B650 Tomahawk WiFi | AM5, DDR5 e BIOS mínima 7D75v10 para o 7600X. A placa é ATX e tem dois conectores físicos CPU_PWR. A quantidade mínima a ligar continua pendente para a regra de compatibilidade. [AMD](https://www.amd.com/en/partner/articles/amd-ryzen-7000-series-desktop-processors.html) · [MSI, ficha](https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/Specification) · [MSI, lista de CPUs](https://www.msi.com/api/v1/product/support/panel?product=MAG-B650-TOMAHAWK-WIFI&type=cpu) |
| Sapphire Pulse RX 6600 e MSI RTX 4060 Ventus 2X Black OC | Respectivamente 193 mm e 199 mm de comprimento. Cada placa usa um conector PCIe de 8 pinos. Ambas cabem em comprimento nos gabinetes dos respectivos exemplos. [Sapphire](https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-6600-8g-gddr6) · [MSI](https://br.msi.com/Graphics-Card/GeForce-RTX-4060-VENTUS-2X-BLACK-8G-OC/Specification) |
| MasterBox Q300L e Corsair 4000D Airflow | Limites de GPU, cooler e fonte de 360/159/160 mm no Q300L e 360/170/220 mm no 4000D, na configuração padrão. [Cooler Master](https://www.coolermaster.com/en-us/products/masterbox-q300l.html) · [Manual Corsair](https://assets.corsair.com/image/upload/v1684779868/corsairmedia/sys_master/productcontent/WW_4000D_4000D_Airflow_QSG_AB.pdf) |
| DeepCool AK400 e AK620 | Alturas de 155 e 160 mm, compatíveis com os limites dos gabinetes dos exemplos. As duas fichas listam AM4 e AM5. A presença do kit de montagem depende do lote. [AK400](https://global.deepcool.com/products/Cooling/cpuaircoolers/AK400-Performance-CPU-Cooler-1700-AM5/2021/15222.shtml) · [AK620](https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620-High-Performance-CPU-Cooler-1700-AM5/2021/13067.shtml) |
| MSI MAG A550BN e A550BNL | As fichas indicam 550 W, 140 mm de profundidade, um EPS 4+4 e dois conectores PCIe 6+2. Os modelos têm fichas separadas. [A550BN](https://us.msi.com/Power-Supply/MAG-A550BN/Specification) · [A550BNL](https://www.msi.com/Power-Supply/MAG-A550BNL/Specification) |
| Kingston ValueRAM e Fury Beast EXPO | `KVR32N22S8/8` é um módulo DDR4 de 8 GB 3200 CL22. `KF560C36BBEK2-32` é um kit DDR5 de 32 GB (2×16 GB), com perfil EXPO de 6000 CL36. A seleção de memória dos dois exemplos continua genérica. [DDR4](https://www.kingston.com/datasheets/KVR32N22S8_8.pdf) · [DDR5](https://www.kingston.com/datasheets/KF560C36BBEK2-32.pdf) |
| Kingston NV2 e Crucial P3 Plus | A ficha identifica o NV2 de 500 GB como `SNV2S/500G`, com 3.500/2.100 MB/s. O P3 Plus de 1 TB é `CT1000P3PSSD8`, com 5.000/3.600 MB/s. As referências do catálogo foram atualizadas para as fichas oficiais. [Kingston](https://www.kingston.com/datasheets/SNV2S_en.pdf) · [Crucial](https://www.crucial.com/content/dam/crucial/ssd-products/p3-plus/flyers/b2c/crucial-p3plus-productflyer-consumer.pdf) |

BIOS instalada, versão dos acessórios do cooler, cabeamento da CV650 e folgas com radiador ou cabos continuam dependendo da unidade usada. Potência e FPS no site continuam sendo estimativas.

### Alternativas que dependem de aprovação

Valores observados em 26/11/2026. Os produtos abaixo ficaram fora do catálogo e dos exemplos.

| Montagem | Alternativa | Oferta observada |
| --- | --- | --- |
| AM4 | Kingston NV3 500 GB M.2 2280, `SNV3S/500G`, para o NV2 de mesma capacidade | R$ 749,90 no Pix, vendido pela TerabyteShop, em estoque. [Oferta](https://www.terabyteshop.com.br/produto/31563/ssd-kingston-nv3-500gb-m2-nvme-2280-pcie-40-leitura-5000mbs-e-gravacao-3000mbs-snv3s500g) |
| AM4 | Dois módulos Kingston ValueRAM DDR4-3200 CL22 de 8 GB, `KVR32N22S8/8` | R$ 1.595,36 no Pix por módulo na KaBuM!, vendido por TRUEX INFORMATICA E HARDWARE. Anúncio unitário em estoque, sem confirmação de duas unidades na mesma compra. [Oferta](https://www.kabum.com.br/produto/1086303/memoria-ram-kingston-ddr4-8gb-3200mhz-kvr32n22s8-8-cl22-desktop-pc-gamer-dimm-1-2v-non-ecc-verde) |
| AM4 | Cooler Master Hyper 212 Spectrum V3, `RR-S4NA-17PA-R1`, para o AK400 | R$ 89,99 no Pix, vendido pela KaBuM!, em estoque. A ficha lista AM4 e 152 mm de altura, dentro dos 159 mm do Q300L. [Oferta](https://www.kabum.com.br/produto/532493/air-cooler-cooler-master-hyper-212-spectrum-v3-argb-intel-e-amd-120mm-preto-rr-s4na-17pa-r1) · [Ficha oficial](https://www.coolermaster.com/en-global/products/hyper-212-spectrum-v3/) |
| AM5 | Kingston NV3 1 TB M.2 2280, `SNV3S/1000G`, para o P3 Plus | R$ 1.129,99 no Pix, vendido pela TerabyteShop, em estoque. [Oferta](https://www.terabyteshop.com.br/produto/31564/ssd-kingston-nv3-1tb-m2-nvme-2280-pcie-40-leitura-6000mbs-e-gravacao-4000mbs-snv3s1000g) |
| AM5 | Corsair CX650 650 W Bronze, `CP-9020278-BR`, para a CV650 | R$ 339,99 no Pix, vendido pela TerabyteShop, em estoque. Ainda exige validar a distribuição dos conectores EPS e PCIe da unidade. [Oferta](https://www.terabyteshop.com.br/produto/28116/fonte-corsair-cx650-650w-80-plus-bronze-pfc-ativo-atx-cp-9020278-br) |
| AM5 | Montech Air 903 Base preto, `AIR 903 BASE (B)`, para o 4000D | R$ 449,99 no Pix, vendido pela TerabyteShop, em estoque. [Oferta](https://www.terabyteshop.com.br/produto/25213/gabinete-gamer-montech-air-903-base-mid-tower-e-atx-black-sem-fonte-com-3-fans) |
| AM5 | MSI RTX 5060 Shadow 2X OC, `912-V537-038`, para a RTX 4060 | R$ 3.499,99 no Pix, vendido pela TerabyteShop, em estoque. A troca de chip exige revisar potência, dimensões, conectores e o índice ilustrativo de FPS. [Oferta](https://www.terabyteshop.com.br/produto/38293/placa-de-video-msi-nvidia-geforce-rtx-5060-shadow-2x-oc-8gb-gddr7-dlss-ray-tracing-912-v537-038) |

O kit Fury Beast EXPO DDR5-6000 CL36 é uma opção de modelo para a AM5, mas a página exata estava esgotada. A seleção desse SKU para o exemplo e a adoção de qualquer substituto dependem de aprovação. [Kingston](https://www.kingston.com/datasheets/KF560C36BBEK2-32.pdf) · [TerabyteShop](https://www.terabyteshop.com.br/produto/24309/memoria-ddr5-kingston-fury-beast-expo-32gb-2x16gb-6000mhz-black-kf560c36bbek2-32)

### Validação e publicação

- `npm test` passou nas oito suítes. A conferência em Chromium, a 1440 px e 390 px, cobriu AM4 e AM5, subtotal, compatibilidade, estimativas de potência e FPS, orçamento com centavos, exportação, salvamento, restauração e compartilhamento com variante de GPU. Também conferiu a diferença de preços no comparador e o estado acessível dos botões.
- `npm run build` gerou `dist/client`. `npm run test:artefato` passou com os 20 arquivos estáticos, os links locais e as verificações de cache e segurança. O Wrangler também aceitou `wrangler.jsonc` na simulação local com `--dry-run`.
- A versão está preparada localmente e aguarda autorização para envio e publicação no Cloudflare. As duas demonstrações continuam com valores parciais. A autorização para publicar os dados revisados e a escolha das substituições podem ser dadas separadamente.

## Revisão final das demonstrações de 26/11/2026

**Recomendação para a apresentação:** priorizar a AM4. Ela tem quatro preços no exemplo atual e uma proposta para cada uma das quatro peças pendentes. A seleção AM5 ainda depende de um cooler com oferta verificável. A única mudança aplicada nesta revisão foi a troca da oferta da XPG Spectrix D35G pelo mesmo SKU a um preço menor. Os exemplos ainda usam a seleção original.

### Situação dos preços

As 14 ofertas ativas foram reabertas e todas exibiam preço e disponibilidade. A classificação das 76 entradas combina essa reconferência, a busca desta revisão para os exemplos e as evidências anteriores para as demais peças.

| Situação | Entradas |
| --- | ---: |
| Produto exato disponível com preço verificável no catálogo | 14 |
| Sem estoque nos anúncios exatos verificados | 49 |
| Modelo, revisão ou SKU insuficientemente identificado | 10 |
| Oferta inconclusiva | 3 |

Doze entradas têm uma alternativa proposta. Essa indicação complementa o estado comercial do produto original. Nenhuma das 62 entradas sem preço ativo foi excluída. A classificação individual, os links das lojas, os preços observados e os resultados de compatibilidade estão em `finalReview` no [registro de evidências](ofertas-consultadas.json).

### Revisão dos preços atípicos

| Produto conferido | Resultado e decisão |
| --- | --- |
| XPG Spectrix D35G `AX4U320016G16A-SBKD35G`, DDR4-3200 CL16, **1×16 GB** | A KaBuM! ainda exibia R$ 1.214,99 no Pix, vendido por TERABYTE. A Pichau tinha o mesmo SKU em estoque por **R$ 1.029,99 no Pix**, vendido pela Pichau. Atualizei a cotação. [Anúncio anterior](https://www.kabum.com.br/produto/495636/memoria-xpg-spectrix-d35g-rgb-16gb-1x16gb-3200mhz-ddr4-preto) · [Oferta cadastrada](https://www.pichau.com.br/memoria-adata-xpg-spectrix-d35g-rgb-16gb-1x16gb-ddr4-3200mhz-c16-preto-ax4u320016g16a-sbkd35g) |
| Samsung 990 PRO `MZ-V9P2T0B/AM`, **um SSD de 2 TB sem dissipador** | Pichau, em estoque, **R$ 4.669,99 no Pix**. A KaBuM! apresentou o mesmo SKU por R$ 6.275,75, vendido por TH INFORMATICA. Um anúncio que usa o mesmo código e descreve dissipador foi descartado por inconsistência com a ficha Samsung. A página pública da LIZ Telecom exibiu o mesmo SKU com status disponível por **R$ 3.266,99 no Pix**. Essa loja está fora das três fontes aceitas pelo site e a leitura foi pela ferramenta de pesquisa. Mantive a oferta da Pichau no catálogo. [Pichau](https://www.pichau.com.br/ssd-samsung-990-pro-2tb-m-2-2280-pcie-nvme-leitura-7450mb-s-gravacao-6900mb-s-mz-v9p2t0b-am) · [LIZ Telecom](https://www.liztelecom.com.br/ssd-samsung-m2-2tb-990-pro-nvme-mz-v9p2t0bam) · [Ficha Samsung](https://www.samsung.com/us/business/memory-storage/solid-state-drives/990-pro-pcie-4-0-nvme-ssd-2tb-sku-mz-v9p2t0b-am/) |
| Kingston ValueRAM `KVR32N22S8/8`, DDR4-3200 CL22, **1×8 GB** | Os R$ 1.595,36 no Pix correspondiam a um módulo vendido por TRUEX INFORMATICA E HARDWARE na KaBuM!. A mesma loja exibia o mesmo SKU em estoque por **R$ 499,80 no Pix por módulo**, vendido por Net Alfa Computadores. A cotação mais baixa entra na proposta. Duas unidades custariam R$ 999,60 ao mesmo preço, sujeito à disponibilidade de duas peças. [Oferta anterior](https://www.kabum.com.br/produto/1086303/memoria-ram-kingston-ddr4-8gb-3200mhz-kvr32n22s8-8-cl22-desktop-pc-gamer-dimm-1-2v-non-ecc-verde) · [Oferta mais baixa](https://www.kabum.com.br/produto/309634/memoria-kingston-8gb-3200mhz-ddr4-cl22-kvr32n22s8-8) |

### AM4 recomendada

Manter ASUS TUF B550M-Plus, Ryzen 5 5500, fonte MSI MAG A550BNL e gabinete Cooler Master Q300L. Esses quatro componentes somam **R$ 2.436,08** no site. As quatro propostas abaixo dependem de aprovação.

| Produto atual | Substituição proposta e motivo | Preço e loja | Impacto na compatibilidade |
| --- | --- | --- | --- |
| Radeon RX 6600. Sapphire Pulse `11310-01-20G` e ASUS Dual `DUAL-RX6600-8G` sem estoque nos anúncios exatos verificados | MSI RTX 5060 Shadow 2X OC `912-V537-038`. Alternativa de outra geração com estoque. A RX 7600 Sapphire Pulse também estava esgotada nas três lojas | **R$ 3.499,99 no Pix**, TerabyteShop, vendido pela TerabyteShop. [Oferta](https://www.terabyteshop.com.br/produto/38293/placa-de-video-msi-nvidia-geforce-rtx-5060-shadow-2x-oc-8gb-gddr7-dlss-ray-tracing-912-v537-038) | 197 mm ante 360 mm do Q300L. A GPU usa um PCIe de 8 pinos, consome 145 W segundo a MSI e recomenda fonte de 550 W, capacidade nominal da fonte da AM4. Exige conferência do cabo e novo índice de FPS no catálogo. [Ficha MSI](https://www.msi.com/Graphics-Card/GeForce-RTX-5060-8G-SHADOW-2X-OC/Specification) |
| DDR4 16 GB 2×8 GB 3200 CL22 genérica | Dois módulos Kingston ValueRAM `KVR32N22S8/8`, se houver duas unidades. Mantém a especificação da demonstração. A busca por kit fechado não confirmou oferta | **R$ 499,80 no Pix por módulo**, KaBuM!, vendido por Net Alfa Computadores. [Oferta](https://www.kabum.com.br/produto/309634/memoria-kingston-8gb-3200mhz-ddr4-cl22-kvr32n22s8-8) | DDR4 UDIMM, 3200 MT/s CL22 por módulo. A B550 aceita DDR4 e o site valida a geração. A disponibilidade do par e o funcionamento conjunto dependem dos módulos recebidos. [Ficha Kingston](https://www.kingston.com/datasheets/KVR32N22S8_8.pdf) |
| Kingston NV2 500 GB `SNV2S/500G` | Kingston NV3 500 GB `SNV3S/500G`, com a mesma capacidade e formato | **R$ 749,90 no Pix**, TerabyteShop, vendido pela TerabyteShop. [Oferta](https://www.terabyteshop.com.br/produto/31563/ssd-kingston-nv3-500gb-m2-nvme-2280-pcie-40-leitura-5000mbs-e-gravacao-3000mbs-snv3s500g) | M.2 2280 NVMe, sem cabo SATA. A velocidade fica limitada à geração PCIe suportada pelo slot e pelo Ryzen 5500. O site não verifica ocupação de slots M.2. [Ficha Kingston](https://www.kingston.com/datasheets/SNV3S_en.pdf) |
| DeepCool AK400 `R-AK400-BKNNMN-G-1` | Cooler Master Hyper 212 Spectrum V3 `RR-S4NA-17PA-R1`, com estoque. A Oficina dos Bits exibiu o AK400 exato por R$ 179,99 no Pix com botão de compra, mas o estoque efetivo ficou sem confirmação direta | **R$ 89,99 no Pix**, vendido pela KaBuM!. [Oferta do Hyper 212](https://www.kabum.com.br/produto/532493/air-cooler-cooler-master-hyper-212-spectrum-v3-argb-intel-e-amd-120mm-preto-rr-s4na-17pa-r1) · [Anúncio do AK400](https://www.oficinadosbits.com.br/produto/cooler-deepcool-ak400-amd-intel-preto-r-ak400-bknnmn-g-1/) | Suporta AM4, tem 152 mm de altura e cabe no limite de 159 mm. O aviso permanece até conferir o kit. [Ficha Cooler Master](https://www.coolermaster.com/en-global/products/hyper-212-spectrum-v3/) |

A soma de todas as propostas da AM4 é **R$ 7.775,56 sem frete**, condicionada à disponibilidade de dois módulos idênticos. A GPU responde por R$ 3.499,99. Se a escolha for preservar a RX 6600, as outras três propostas levariam a uma cotação condicional de **7 de 8 peças, R$ 4.275,57**, com a GPU ainda sem preço.

### AM5 recomendada

O exemplo atual permanece em **1 de 8 peças com preço, R$ 1.089,99**, do Ryzen 5 7600X. As seguintes opções priorizam peças identificáveis e disponíveis. O subtotal hipotético com as seis propostas cotadas seria **R$ 12.609,93 sem frete**, ainda faltando o cooler.

| Produto atual | Alternativa ou pendência | Compatibilidade e oferta |
| --- | --- | --- |
| MSI MAG B650 Tomahawk WiFi | ASRock B650M-HDV/M.2 `90-MXBLA0-A0UAYZ` | AM5, DDR5, Micro-ATX, ATX de 24 pinos e EPS de 8 pinos. Sem Wi-Fi integrado. A ASRock lista BIOS mínima 1.17 para o Ryzen 5 7600X. A BIOS instalada precisa ser conferida. A oferta da KaBuM! exibia SKU truncado. A oferta com SKU completo é de **R$ 899,99 no Pix**, vendida pela TerabyteShop. [Oferta](https://www.terabyteshop.com.br/produto/27285/placa-mae-asrock-b650m-hdvm2-chipset-b650-amd-am5-m-atx-ddr5-90-mxbla0-a0uayz) · [Ficha ASRock](https://www.asrock.com/MB/AMD/B650M-HDVM.2/index.asp) · [Lista de BIOS por CPU](https://www.asrock.com/support/cpu.asp?s=AM5&u=699) |
| RTX 4060 MSI Ventus ou ASUS Dual | MSI RTX 5060 Shadow 2X OC `912-V537-038` | **R$ 3.499,99 no Pix**, vendida pela TerabyteShop. 197 mm e um PCIe de 8 pinos. Rever consumo e FPS com a mudança de chip. [Oferta](https://www.terabyteshop.com.br/produto/38293/placa-de-video-msi-nvidia-geforce-rtx-5060-shadow-2x-oc-8gb-gddr7-dlss-ray-tracing-912-v537-038) |
| DDR5 32 GB 2×16 6000 CL36 genérica | Corsair Vengeance `CMK32GX5M2E6000C36`, opção de custo alto. O Kingston Fury Beast EXPO e o Crucial Pro CL36 estavam esgotados nas ofertas verificadas | **R$ 5.199,99 no Pix**, vendido pela KaBuM!. A ficha desse SKU indica perfil XMP e SPD de 4800 MT/s. O site valida DDR5. A operação em 6000 CL36 depende de BIOS, suporte do kit e configuração. [Oferta](https://www.kabum.com.br/produto/506124/memoria-ram-corsair-vengeance-32gb-2x16gb-6000mhz-ddr5-cl36-preto-cmk32gx5m2e6000c36) · [Ficha Corsair](https://www.corsair.com/us/en/p/memory/cmk32gx5m2e6000c36/vengeance-32gb-2x16gb-ddr5-dram-6000mt-s-c36-memory-kit-black-cmk32gx5m2e6000c36) |
| Crucial P3 Plus 1 TB `CT1000P3PSSD8` | Kingston NV3 1 TB `SNV3S/1000G`. A Guerra Digital exibia o P3 Plus por R$ 374,10 no Pix, mas a disponibilidade efetiva ficou inconclusiva | **R$ 1.129,99 no Pix**, vendido pela TerabyteShop. M.2 2280 NVMe sem alimentação SATA. [Oferta](https://www.terabyteshop.com.br/produto/31564/ssd-kingston-nv3-1tb-m2-nvme-2280-pcie-40-leitura-6000mbs-e-gravacao-4000mbs-snv3s1000g) |
| Corsair CV650 `CP-9020211-BR` | Corsair CX650 `CP-9020278-BR` | **R$ 339,99 no Pix**, vendida pela TerabyteShop. 650 W e formato ATX. Confirmar cabos EPS e PCIe da unidade brasileira antes de marcar os avisos como resolvidos. [Oferta](https://www.terabyteshop.com.br/produto/28116/fonte-corsair-cx650-650w-80-plus-bronze-pfc-ativo-atx-cp-9020278-br) |
| Corsair 4000D Airflow `CC-9011200-WW` | Montech AIR 903 BASE preto | **R$ 449,99 no Pix**, vendido pela TerabyteShop. Aceita ATX e Micro-ATX, GPU de até 400 mm, cooler de até 180 mm e fonte ATX de até 240 mm. [Oferta](https://www.terabyteshop.com.br/produto/25213/gabinete-gamer-montech-air-903-base-mid-tower-e-atx-black-sem-fonte-com-3-fans) · [Ficha Montech](https://www.montechpc.com/air-903-base) |
| DeepCool AK620 `R-AK620-BKNNMT-G` | Manter pendente. AK620, Peerless Assassin 120 SE, Phantom Spirit 120 SE, Hyper 622 Halo e os AG620 consultados sem anúncio exato em estoque confirmado | O AK620 cadastrado tem 160 mm, dentro dos limites dos dois gabinetes. A compatibilidade de montagem depende do kit AM5 e a folga sobre a RAM precisa ser conferida. |

### Compatibilidade e testes

- Usei as regras reais do NTJ Builder em uma simulação local das propostas, com dados temporários em memória. O verificador aceitou soquete, geração da RAM e limites de formato e dimensões nas duas plataformas. Manteve pendentes a BIOS instalada, os cabos e o kit do cooler. Para a AM4, simulei também as confirmações de BIOS 2423, kit e fonte. As regras de alimentação e encaixe passaram nessa condição simulada. Folgas físicas e refrigeração continuam pendentes. A simulação AM5 preservou o AK620 como referência técnica, ainda sem cotação.
- Após a atualização da XPG, executei `npm test` e as oito suítes passaram. `npm run build` gerou o artefato e `npm run test:artefato` passou com 20 arquivos estáticos.
- Rodei os dois exemplos atuais no Chromium a 1440 e 390 px. Testei comparador, acessibilidade das categorias, montador, avisos, FPS ilustrativo, orçamento com centavos, exportação, salvamento, restauração e compartilhamento com variante de GPU. Os subtotais conferiram e as estimativas continuaram em 251 W na AM4 e 283 W na AM5.

### Arquivos preparados para publicação

O artefato local em `dist/client` contém estes 20 arquivos. O Wrangler foi executado em modo `--dry-run` com `wrangler.jsonc`. O envio de versão e a publicação aguardam autorização.

- Raiz e imagens — `index.html`, `favicon.ico`, `favicon.svg`, `img/textura-rgb-claro.svg`, `img/textura-rgb.svg`.
- Estilo e dados — `css/style.css`, `dados/catalogo.js`, `dados/especificacoes.js`, `dados/ofertas.js`, `dados/referencias.js`.
- Lógica — `js/comparador.js`, `js/compartilhar.js`, `js/compatibilidade.js`, `js/iniciar.js`, `js/interface-validacoes.js`, `js/montador.js`, `js/precos.js`, `js/tema.js`, `js/utilitarios.js`, `js/validacoes.js`.

### Decisões para a próxima versão

1. Aprovar individualmente as opções da AM4. A troca mais cara é a GPU. Adotar o NV3 e o Hyper 212 e validar a disponibilidade do par de RAM já adianta a demonstração, mesmo mantendo a RX 6600.
2. Decidir se a AM5 segue como demonstração secundária com subtotal ou se vale aprovar as opções da tabela. A seleção de memória ainda é uma decisão importante pelo valor observado.
3. Decidir se vale acrescentar LIZ Telecom às fontes do site após reconfirmar a oferta direta do Samsung. A lista atual aceita as três lojas originais.
4. Autorizar separadamente o envio e a publicação do artefato. Se houver substituições aprovadas antes disso, a versão resultante passa novamente pelos testes.

## Cobertura comercial do catálogo em 26/11/2026

Foram analisadas as **76 entradas comerciais**, incluindo os 24 modelos físicos de GPU. O catálogo local passou de **14 para 19 ofertas ativas**. São **5 preços novos**, 1 oferta corrigida para o MPN exato e **57 entradas sem preço confirmado**. A pesquisa incluiu reabertura de anúncios, buscas nominais ou por SKU e consultas a lojas além das três fontes cadastradas. A lista individual com anúncios, status, SKU, vendedor, condição, valor e data está em `catalogCommercialReview`. [Evidências por componente](ofertas-consultadas.json)

| Categoria | Registros | Com preço | Sem estoque nos anúncios exatos | SKU ou revisão pendente | Oferta inconclusiva | Descontinuado |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Processadores | 8 | 5 | 2 | 0 | 1 | 0 |
| Placas-mãe | 5 | 2 | 3 | 0 | 0 | 0 |
| GPUs e variantes físicas | 24 | 0 | 20 | 3 | 1 | 0 |
| Memórias | 8 | 2 | 1 | 4 | 1 | 0 |
| SSDs e HDs | 9 | 6 | 2 | 1 | 0 | 0 |
| Fontes | 10 | 2 | 3 | 3 | 2 | 0 |
| Gabinetes | 6 | 1 | 4 | 0 | 0 | 1 |
| Coolers | 6 | 1 | 5 | 0 | 0 | 0 |
| **Total** | **76** | **19** | **40** | **11** | **5** | **1** |

### Preços cadastrados nesta revisão

| Produto e SKU | À vista no Pix | Loja e vendedor |
| --- | ---: | --- |
| Kingston Fury Beast DDR4-3200 CL16, 1×8 GB, `KF432C16BB/8WP` | R$ 586,68 | KaBuM!, BFTECH. [Anúncio](https://www.kabum.com.br/produto/984742/memoria-8gb-ddr4-3200mhz-cl16-kingston-fury-beast-black-desktop-kf432c16bb-8wp) |
| Kingston KC3000 2 TB, `SKC3000D/2048G` | R$ 2.999,99 | Pichau. [Anúncio](https://www.pichau.com.br/ssd-kingston-kc3000-2tb-m-2-2280-pcie-nvme-leitura-7000mb-s-gravacao-7000mb-s-skc3000d-2048g) |
| WD_BLACK SN850X 1 TB, `WDS100T2X0E` | R$ 2.498,99 | KaBuM!, anunciado sob a marca SanDisk com o mesmo MPN da ficha WD_BLACK. [Anúncio](https://www.kabum.com.br/produto/379756/ssd-sandisk-sn850x-gaming-storage-1tb-m-2-2280-pcie-gen4x4-nvme-leitura-7300-mb-s-e-gravacao-6300-mb-s-preto-wds100t2x0e) |
| Mancer Thunder 500 W Bronze, `MCR-THR500-BL01` | R$ 194,99 | Pichau. [Anúncio](https://www.pichau.com.br/fonte-mancer-thunder-500w-bronze-80-plus-mcr-thr500-bl01) |
| DeepCool AK400 preto, `R-AK400-BKNNMN-G-1` | R$ 189,99 | Pichau. [Anúncio](https://www.pichau.com.br/cooler-para-processador-deepcool-ak400-120mm-r-ak400-bknnmn-g-1) |
| MSI MAG A550BN, `306-7ZP2A22-CE0`, correção de oferta existente | R$ 329,85 | KaBuM!, GIGANTEC. Substitui a cotação comercial da **A550BNL**. [Anúncio](https://www.kabum.com.br/produto/419386/fonte-de-alimentacao-msi-mag-a550bn-550w-80-plus-bronze-pfc-ativo-cabo) |

### Pendências e propostas

- **Esgotados e descontinuação.** O status de estoque se limita aos anúncios dos modelos exatos consultados. A Corsair marca o 4000D Airflow preto `CC-9011200-WW` como descontinuado. As páginas consultadas para Crucial P3 Plus, Sapphire RX 7700 XT e CH370 na Guerra Digital também mostraram “Esgotado”, apesar de ainda exibir valores. [Corsair](https://www.corsair.com/ww/pt/p/pc-cases/cc-9011200-ww/40)
- **Oferta inconclusiva.** O anúncio do Ryzen 9 7950X na KaBuM! exibe o MPN correto, mas o título e a ficha divergem em dados do processador. A busca não confirmou a RTX 4090 Founders Edition exata. A fonte Aerocool Lux 550 W e a Galax Omega GL500S também ficaram sem anúncio exato verificável. O kit Corsair Vengeance 64 GB CL30 tem uma página indexada na Live Store com o SKU correto, mas o estoque atual e a condição de compra precisam ser reconfirmados diretamente.
- **Identificação ainda necessária.** As fontes EVGA SuperNOVA 850 W, Cooler Master MWE 750 W Bronze e Seasonic Focus GX-650, o HD BarraCuda 2 TB e as variantes ASUS TUF RX 7900 XTX OC, TUF RX 7800 XT OC e Dual RTX 4060 Ti OC precisam de definição ou reconfirmação de revisão. As quatro memórias genéricas estão detalhadas abaixo.

| Entrada genérica | Modelo identificado | Condição comercial ou diferença |
| --- | --- | --- |
| DDR4-3200 CL22, 16 GB (2×8 GB) | Dois Kingston ValueRAM `KVR32N22S8/8` | R$ 499,80 no Pix por unidade, Net Alfa Computadores na KaBuM!. A disponibilidade do segundo módulo precisa ser confirmada. O kit fechado Fury Beast `KF432C16BBK2/16` muda de CL22 para CL16 e foi observado no Magalu por R$ 1.282,50 em 1×, vendido por daxfystore. Entrega por CEP pendente. [Módulo avulso](https://www.kabum.com.br/produto/309634/memoria-kingston-8gb-3200mhz-ddr4-cl22-kvr32n22s8-8) · [Kit fechado](https://www.magazineluiza.com.br/memoria-ram-kingston-fury-beast-16gb-2x8gb-ddr4-3200mhz-cl16-kf432c16bbk2-16-preto/p/cab5j7ak5c/in/mram/?seller_id=daxfystore) |
| DDR4-3600 CL18, 32 GB (2×16 GB) | Kingston Fury Beast `KF436C18BBK2/32` | Especificação correspondente, sem preço ativo verificado. [Magalu](https://www.magazineluiza.com.br/memoria-ram-kingston-fury-beast-32gb-2x16gb-3600mhz-ddr4-cl18-preto-kf436c18bbk2-32/p/fag3e8f5c9/in/mram/) |
| DDR5-5600 CL40, 16 GB (2×8 GB) | Kingston Fury Beast `KF556C40BBK2/16` | Especificação correspondente. Pichau e KaBuM! sinalizaram esgotado. [Pichau](https://www.pichau.com.br/memoria-kingston-fury-beast-16gb-2x8gb-ddr5-5600mhz-c40-preto-kf556c40bbk2-16) |
| DDR5-6000 CL36, 32 GB (2×16 GB) | Corsair Vengeance `CMK32GX5M2E6000C36` | R$ 5.199,99 no Pix, vendido pela KaBuM!. 6000 CL36 é o perfil XMP, com SPD de 4800 MT/s. [KaBuM!](https://www.kabum.com.br/produto/506124/memoria-ram-corsair-vengeance-32gb-2x16gb-6000mhz-ddr5-cl36-preto-cmk32gx5m2e6000c36) |

Propostas comerciais para desbloquear peças específicas, mediante aprovação. A ASRock RX 7600 Challenger `90-GA41ZZ-00UANF` está em estoque a R$ 1.899,99 e pode ser cadastrada como variante **adicional** do chip RX 7600. Para o NV2 500 GB, o Hiksemi Future Lite 512 GB tem oferta a R$ 699,90. Para o P3 Plus 1 TB, o Kingston NV3 1 TB custa R$ 1.199,90. Para o 4000D, o Montech AIR 903 BASE custa R$ 449,99 e tem dimensões próprias. Para a CV650, a CX650 `CP-9020278-BR` custa R$ 339,99, com cabos a conferir. Os demais casos continuam com “Preço não disponível” no site, inclusive onde nenhuma substituição comparável foi verificada. [RX 7600](https://www.kabum.com.br/produto/459144/placa-de-video-rx-7600-challenger-asrock-amd-radeon-8gb-gddr6-90-ga41zz-00uanf) · [Hiksemi](https://www.terabyteshop.com.br/produto/37315/ssd-hiksemi-future-lite-512gb-m2-2280-nvme-leitura-6320mbs-e-gravacao-3111mbs-hs-ssd-future-lite-512g) · [NV3 1 TB](https://www.terabyteshop.com.br/produto/31564/ssd-kingston-nv3-1tb-m2-nvme-2280-pcie-40-leitura-6000mbs-e-gravacao-4000mbs-snv3s1000g) · [Montech](https://www.terabyteshop.com.br/produto/25213/gabinete-gamer-montech-air-903-base-mid-tower-e-atx-black-sem-fonte-com-3-fans) · [CX650](https://www.terabyteshop.com.br/produto/28116/fonte-corsair-cx650-650w-80-plus-bronze-pfc-ativo-atx-cp-9020278-br)

Se houver aprovação para reconferir as duas fontes externas com possibilidades concretas, acrescente `www.livestoreonline.com.br` e `www.magazineluiza.com.br` à lista restrita de saída da configuração do ambiente Codex, preservando as permissões existentes. Execute nova leitura das páginas no ambiente atualizado para confirmar estoque e vendedor. Para cadastrar ofertas delas no site, a alteração proposta é adicionar os hosts a `STORE_HOSTS`, aceitar apenas caminhos diretos de produto de cada loja e limitar a consulta de marketplace ao identificador de vendedor permitido. A alteração precisa de testes de validação de URL e da aprovação do usuário.

### Testes e publicação

As oito suítes de `npm test`, `npm run build` e `npm run test:artefato` passaram. O Chromium verificou as 76 entradas em 1440 px e 390 px, cobrindo preços, links, subtotal, troca de peças, diferenças no comparador, exportação e restauração de link com variante de GPU. Os testes automatizados conferiram a diferença entre duas variantes do mesmo chip com cotações de teste. As 24 variantes reais ainda exibem preço indisponível quando selecionadas, pois nenhuma oferta exata em estoque foi confirmada. O teste de artefato inicialmente confundiu o trecho `sk-` no endereço do produto SanDisk com o início de uma credencial. O teste passou após exigir limite de palavra antes desse prefixo. A simulação local do Wrangler foi concluída. O artefato está pronto localmente. Não houve commit, upload ou publicação.


## Precificação do catálogo em 26/11/2026

Esta revisão cobre 81 entradas comerciais, incluindo 25 modelos físicos de GPU. Há 24 ofertas atuais, 49 referências históricas documentadas e 8 registros sem valor verificável. Foram adicionados 54 valores. Nenhum componente recebeu um valor estimado. O resumo pode calcular uma estimativa de montagem a partir das ofertas e das referências documentadas. [Registro por entrada](ofertas-consultadas.json)

As referências registram o SKU, a fonte, a data e a condição observada. Entram nessa categoria cotações de 19/10/2026, a promoção encerrada da Sapphire RX 7900 XTX registrada pelo PromoTop e valores lidos em páginas sem estoque em 26/11/2026. Neste último caso, a nota indica se a página exibia Pix ou se o valor veio dos dados do anúncio, com condição de pagamento pendente. Um valor lido em página esgotada informa o registro comercial na data da consulta, sem evidência de uma venda anterior.

Cinco produtos foram adicionados com identificadores próprios. ASRock RX 7600 Challenger 8 GB OC, Hiksemi Future Lite 512 GB, Kingston NV3 1 TB, Montech AIR 903 BASE preto e Corsair CX650. Os SSDs ficaram sem nota ilustrativa e sem consumo cadastrado. A fonte CX650 tem a variante BR confirmada no anúncio. Sua ficha de família é da variante NA e as verificações de cabos da BR seguem pendentes.

Três kits genéricos receberam identidades comerciais com a mesma capacidade, quantidade de módulos, velocidade e latência. São eles Kingston KF560C36BBEK2/32, KF556C40BBK2-16 e KF436C18BB2AK2/32. Os identificadores e exemplos foram preservados. O Crucial CT2K8G4DFRA32A corresponde ao kit DDR4 16 GB CL22. A configuração genérica permanece disponível enquanto o preço brasileiro do kit estiver sem confirmação suficiente.

Para manutenção, use `PRODUCT_OFFERS` para as ofertas atuais, `PRODUCT_PRICE_REFERENCES` para valores históricos ou estimativas fundamentadas, e `PRODUCT_PRICE_GAPS` para explicar a falta de valor. Uma estimativa exige metodologia e dois endereços seguros distintos. O PromoTop tem permissão específica para links de referências de GPU. As lojas de compra continuam KaBuM!, Pichau e TerabyteShop.

`npm test`, `npm run build` e `npm run test:artefato` passaram. O Chromium conferiu as 81 entradas em 1440 px e 390 px, incluindo os links, a estimativa separada, o orçamento, a troca de variante, a exportação e a restauração por link. A política de rede do ambiente confirmou 33 domínios personalizados ativos. O site público respondeu HTTP 200, a API do Cloudflare confirmou a credencial por GET e as páginas de produto de KaBuM!, Pichau e TerabyteShop e as fichas AMD e MSI responderam HTTP 200 nas consultas respectivas.

### Revisão das oito pendências

Foram acrescentadas três referências históricas. O kit DDR4 de 16 GB passou a identificar o TeamGroup Elite `TED416G3200C22DC01` por R$ 269,99 no Pix na Pichau. O HD BarraCuda 2 TB passou a identificar o `ST2000DM001` por R$ 443,66 no Pix na Premium Informática. Sua ficha oficial informa 156 MB/s em média, em lugar dos 160 MB/s aproximados do cadastro anterior. A RTX 4090 Founders Edition recebeu o valor de R$ 16.999,00 exibido pela Blast. As três páginas indicavam falta de estoque. Os valores da Premium e da Blast foram consultados em cópias indexadas das páginas das lojas.

As 24 ofertas atuais e as 49 referências anteriores foram preservadas. O catálogo tem agora 52 referências históricas e cinco itens sem valor verificável. São eles Kingston Fury Beast DDR5 de 16 GB, EVGA SuperNOVA 850 W, Cooler Master MWE 750 W Bronze, Seasonic Focus GX-650 e Aerocool Lux 550 W. Os links das duas novas lojas ficam restritos às páginas exatas das referências históricas. [Evidências da revisão](ofertas-consultadas.json)
