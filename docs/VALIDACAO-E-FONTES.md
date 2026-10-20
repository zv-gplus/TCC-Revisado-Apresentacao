# BIOS, gabinete e conectores — cobertura atual

Base ampliada em 19/10/2026 com fontes oficiais. As fichas anteriores foram consultadas em 17/10/2026. Os testes verificam o software com DOM simulado; não foram feitos ensaios de bancada nem uma nova conferência visual em navegador nesta revisão.

## Como usar

1. Escolha as oito peças, incluindo gabinete e cooler.
2. Informe somente a BIOS que você conferiu na placa. Se não souber ou a versão não estiver na lista, mantenha “Não sei”.
3. Selecione o modelo exato da GPU somente se corresponder à sua placa. O chip sozinho não identifica tamanho nem conectores.
4. Confirme fonte/revisão/cabos e kit do cooler somente depois de conferir os acessórios.
5. Leia as explicações e fontes em “BIOS, dimensões e conectores”.

“Sem conflito identificado” vale para a regra indicada. “Incompatível” indica conflito confirmado nos dados. “Precisa conferir” indica dado ausente ou análise fora do alcance da regra. O site não detecta a BIOS instalada e não baixa nem instala firmware.

## O que foi ampliado

- As cinco placas-mãe agora oferecem opções de BIOS documentadas: 59 versões no total. B650 Tomahawk ganhou 27 versões e A520M-A Pro ganhou 22, sem os rótulos beta da lista consultada.
- As 12 GPUs têm dois modelos físicos, com dimensões e conectores da ficha oficial. Antes eram dois modelos; agora são 24.
- Gabinetes: de dois para seis. Coolers: de dois para seis, todos a ar.
- Identificadores e primeiras peças foram preservados para manter montagens antigas.
- As seleções novas funcionam no salvamento, restauração e exportação. Compartilhamento continua sem levar confirmações pessoais de BIOS/cabos/kit.

Não há sincronização automática. Os preços passaram a vir do cadastro manual em frontend/ofertas.js, conforme docs/OFERTAS-E-PRECOS.md. Somente o modelo exato recebe a oferta; dados ausentes não são preenchidos com preços ilustrativos. Consumo e FPS continuam estimativas do chip, não medições da variante física. Overclock e revisões podem mudar esses valores.

## BIOS: nove pares com mínimo confirmado

| Placa-mãe | CPU do catálogo | BIOS mínima |
| --- | --- | --- |
| MSI B650 Tomahawk WiFi | AMD Ryzen 9 7950X | 7D75v10 |
| MSI B650 Tomahawk WiFi | AMD Ryzen 7 7700X | 7D75v10 |
| MSI B650 Tomahawk WiFi | AMD Ryzen 5 7600X | 7D75v10 |
| MSI A520M-A Pro | AMD Ryzen 5 5500 | 7C96v19 |
| ASUS ROG Strix Z790-E Gaming WiFi | Intel Core i9-14900K | 1202 |
| ASRock B660M Phantom Gaming 4 | Intel Core i5-13600K | 6.02 |
| ASRock B660M Phantom Gaming 4 | Intel Core i7-13700K | 6.02 |
| ASRock B660M Phantom Gaming 4 | Intel Core i9-14900K | 10.02 |
| ASUS TUF Gaming B550M-Plus | AMD Ryzen 5 5500 | 2423 |

Existem 13 pares com mesmo soquete; nove têm mínimo confirmado e quatro continuam pendentes. Não se deduz suporte por geração ou data da BIOS. As versões são comparadas pela ordem de lançamento cadastrada para aquela placa, nunca como um número universal. Por exemplo, a MSI publicou 7D75v1M3 antes de 7D75v1M. Versão inventada não é aceita como mais nova.

As listas MSI foram consultadas nos dados públicos que alimentam o próprio suporte oficial. O resumo com datas, mínimos e URLs está em fontes-bios-msi.json. A página carrega o conteúdo dinamicamente; a tabela não aparece em leitores simples de HTML. O site do TCC usa somente o catálogo local: não depende dessa API durante a apresentação.

A lista é uma seleção documentada, não garantia de todas as versões existentes ou da mais recente. Atender ao mínimo de CPU não significa conter todas as correções de estabilidade e segurança. Toda atualização deve seguir o procedimento do fabricante.

## Gabinetes

| Modelo | Formatos cadastrados | GPU máxima | Cooler máximo | Fonte ATX máxima |
| --- | --- | ---: | ---: | ---: |
| Cooler Master MasterBox Q300L (MCB-Q300L-KANN-S00) | Micro-ATX, Mini-ITX | 360 mm | 159 mm | 160 mm |
| Corsair 4000D Airflow (CC-9011200-WW) | ATX, Micro-ATX, Mini-ITX | 360 mm | 170 mm | 220 mm |
| DeepCool CH370 | Micro-ATX, Mini-ITX | 378 mm | 165 mm | 160 mm |
| DeepCool CC560 | ATX, Micro-ATX, Mini-ITX | 370 mm | 163 mm | 170 mm |
| DeepCool CC560 V2 | ATX, Micro-ATX, Mini-ITX | 370 mm | 165 mm | 170 mm |
| DeepCool CH560 | ATX, Micro-ATX, Mini-ITX | 380 mm | 175 mm | 170 mm |

Os limites consideram a configuração padrão. Radiador frontal pode reduzir o comprimento: no CH370, a ficha informa 320 mm com radiador frontal, em vez de 378 mm. Como esta versão cadastra apenas coolers a ar, o projeto não valida radiadores. E-ATX não faz parte do catálogo de placas-mãe. O suporte a E-ATX anunciado em um texto do CC560 V2 não foi usado: sua tabela técnica lista ATX/Micro-ATX/Mini-ITX.

## Coolers

| Modelo | Altura | Soquetes do catálogo |
| --- | ---: | --- |
| DeepCool AK400 | 155 mm | AM4, AM5, LGA1700 |
| DeepCool AK620 | 160 mm | AM4, AM5, LGA1700 |
| DeepCool AG400 | 150 mm | AM4, AM5, LGA1700 |
| DeepCool AG500 BK ARGB | 155 mm | AM4, AM5, LGA1700 |
| DeepCool AG620 (R-AG620-BKNNMN-G-1) | 157 mm | AM4, AM5, LGA1700 |
| DeepCool AK500 Zero Dark | 158 mm | AM4, AM5, LGA1700 |

A confirmação do kit continua obrigatória: lotes antigos podem exigir outro acessório. Altura e soquete não comprovam capacidade térmica, espaço sob a ventoinha ou interferência na RAM.

## Modelos físicos de GPU

| Modelo | Comprimento × largura × espessura | Alimentação | Fonte de sistema sugerida |
| --- | --- | --- | --- |
| MSI RTX 4060 Ventus 2X Black 8G OC | 199 × 120 × 41 mm | 1 × 8 pinos | 550 W |
| NVIDIA RTX 4090 Founders Edition | 304 × 137 × 61 mm | 1 × 16 pinos | 850 W |
| Sapphire Pulse RX 7900 XTX 24GB | 313 × 133.75 × 52.67 mm | 3 × 8 pinos | 800 W |
| Sapphire Pulse RX 7800 XT 16GB | 280 × 128.75 × 52.57 mm | 2 × 8 pinos | 700 W |
| Sapphire Pulse RX 7700 XT 12GB | 280 × 128.75 × 52.57 mm | 2 × 8 pinos | 700 W |
| Sapphire Pulse RX 7600 8GB | 240 × 107.1 × 44.07 mm | 1 × 8 pinos | 550 W |
| Sapphire Pulse RX 6600 8GB | 193 × 120.05 × 40.05 mm | 1 × 8 pinos | 500 W |
| Sapphire Pulse RX 580 8GB | 230 × 125 × 40 mm | 1 × 8 pinos | 500 W |
| MSI RTX 4070 Ti Ventus 3X 12G OC | 308 × 123 × 52 mm | 1 × 16 pinos | 700 W |
| MSI RTX 4070 Ti Super 16G Ventus 3X OC | 308 × 120 × 52 mm | 1 × 16 pinos | 700 W |
| MSI RTX 4060 Ti Ventus 2X Black 8G OC | 199 × 120 × 42 mm | 1 × 8 pinos | 550 W |
| MSI RTX 3060 Ventus 2X 12G OC | 235 × 124 × 42 mm | 1 × 8 pinos | Ainda não cadastrada |
| ASUS TUF Gaming RX 7900 XTX OC 24GB | 352.9 × 158.2 × 72.6 mm | 3 × 8 pinos | 850 W |
| ASUS TUF Gaming RX 7800 XT OC 16GB | 319.8 × 150.9 × 59.2 mm | 2 × 8 pinos | 750 W |
| ASUS Dual RX 7700 XT OC 12GB | 279.9 × 133.9 × 49.3 mm | 2 × 8 pinos | 750 W |
| ASUS Dual RX 7600 OC 8GB | 245 × 134 × 49 mm | 1 × 8 pinos | 550 W |
| ASUS Dual RX 6600 8GB | 243 × 134 × 49 mm | 1 × 8 pinos | 500 W |
| MSI RX 580 Armor 8G OC | 269 × 125 × 38 mm | 1 × 8 pinos | 500 W |
| ASUS TUF Gaming RTX 4090 OC 24GB | 348.2 × 150 × 72.6 mm | 1 × 16 pinos | 850 W |
| ASUS TUF Gaming RTX 4070 Ti OC 12GB | 305 × 138 × 65 mm | 1 × 16 pinos | 750 W |
| ASUS TUF Gaming RTX 4070 Ti Super OC 16GB | 305 × 138 × 65 mm | 1 × 16 pinos | 750 W |
| ASUS Dual RTX 4060 OC 8GB | 227.2 × 123.24 × 49.6 mm | 1 × 8 pinos | 550 W |
| ASUS Dual RTX 4060 Ti OC 8GB | 227.2 × 123.24 × 49.6 mm | 1 × 8 pinos | 650 W |
| ASUS Dual RTX 3060 V2 OC 12GB | 200 × 123 × 38 mm | 1 × 8 pinos | 650 W |

A ficha MSI das duas RTX 4070 Ti confirma o conector de 16 pinos, mas a capacidade de cabo/adaptador do modelo não foi cadastrada: a alimentação permanece pendente. Não foi transferida a especificação de um modelo NVIDIA de referência para uma placa MSI. A recomendação de fonte de sistema da RTX 3060 também permanece pendente; dimensões e conector já podem ser conferidos.

A 4090 Founders Edition mantém a regra de cabo nativo de pelo menos 450 W; adaptador não é aprovado somente pela quantidade de plugs. A Sapphire RX 7900 XTX Pulse exige três conectores de 8 pinos, portanto a fonte MSI A550BN com dois plugs é sinalizada como incompatível nessa regra.

O teste físico compara comprimento com o limite de gabinete. Largura, slots, espaço lateral para curvar o cabo, folgas e dissipação permanecem para conferência manual.

## Fontes e placa-mãe

MSI MAG A550BN: 1 ATX 24, 1 EPS 4+4, 2 PCIe 6+2, 5 SATA e comprimento de 140 mm. MSI MAG A750GL PCIE5 na ficha regional consultada: 1 ATX 24, 2 EPS 4+4, 3 PCIe 6+2, 1 conector nativo de 16 pinos para 450 W, 8 SATA e 140 mm. Confirme modelo, revisão e cabos. Plugs não comprovam cabos independentes.

As placas com conectores de alimentação cadastrados continuam sendo B550M-Plus (ATX24 + CPU8) e A520M-A Pro (ATX24 + CPU4). As outras três placas e oito fontes permanecem pendentes nessa regra. EPS de CPU e PCIe de GPU não são intercambiáveis.

Para SATA, a regra confere um conector de energia, sem validar cabo de dados, baia, portas ou compartilhamento M.2.

## Testes desta ampliação

- node testes-validacoes.cjs: 46 testes específicos e 172.800 cenários, além da regressão anterior.
- node tests/catalogo.cjs: 14 testes de cobertura, BIOS mínima/antiga, opções, variantes, conflitos, dados ausentes e salvar/restaurar.
- Os relatórios JSON acompanham o projeto. Tema, estados visuais e compartilhamento também devem passar antes de publicar.

## Referências oficiais

- ASUS TUF Gaming RX 7900 XTX OC 24GB — ficha oficial: https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rx7900xtx-o24g-gaming/techspec/
- ASUS TUF Gaming RX 7800 XT OC 16GB — ficha oficial: https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rx7800xt-o16g-gaming/techspec/
- ASUS Dual RX 7700 XT OC 12GB — ficha oficial: https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rx7700xt-o12g/techspec/
- ASUS Dual RX 7600 OC 8GB — ficha oficial: https://www.asus.com/uk/motherboards-components/graphics-cards/dual/dual-rx7600-o8g/techspec/
- ASUS Dual RX 6600 8GB — ficha oficial: https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rx6600-8g/techspec/
- MSI RX 580 Armor 8G OC — ficha oficial: https://www.msi.com/Graphics-Card/Radeon-RX-580-ARMOR-8G-OC/Specification
- ASUS TUF Gaming RTX 4090 OC 24GB — ficha oficial: https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx4090-o24g-gaming/techspec/
- ASUS TUF Gaming RTX 4070 Ti OC 12GB — ficha oficial: https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx4070ti-o12g-gaming/techspec/
- ASUS TUF Gaming RTX 4070 Ti Super OC 16GB — ficha oficial: https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx4070tis-o16g-gaming/techspec/
- ASUS Dual RTX 4060 OC 8GB — ficha oficial: https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx4060-o8g/techspec/
- ASUS Dual RTX 4060 Ti OC 8GB — ficha oficial: https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx4060ti-o8g/techspec/
- ASUS Dual RTX 3060 V2 OC 12GB — ficha oficial: https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx3060-o12g-v2/techspec/
- MSI — BIOS e CPUs da MAG B650 Tomahawk WiFi: https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/support
- MSI — BIOS e CPUs da A520M-A Pro: https://www.msi.com/Motherboard/A520M-A-PRO/support
- DeepCool — CH370: https://global.deepcool.com/products/Cases/CH370-Micro-ATX-Case/2022/15949.shtml
- DeepCool — CC560: https://global.deepcool.com/products/Cases/fulltowercases/CC560-Mid-Tower-ATX-PC-Case/2021/15216.shtml
- DeepCool — CC560 V2: https://www.deepcool.com/products/Cases/CC560-V2-Mid-Tower-Airflow-Case/2023/17782.shtml
- DeepCool — CH560: https://www.deepcool.com/products/Cases/CH560-New-Generation-of-Airflow-Case/2023/17101.shtml
- DeepCool — AG400: https://pt.deepcool.com/products/Cooling/cpuaircoolers/GAMMAXX-AG400-Single-Tower-CPU-Cooler-1700-AM5/2022/15935.shtml
- DeepCool — AG500 BK ARGB: https://www.deepcool.com/products/Cooling/cpuaircoolers/AG500-BK-ARGB-Performance-CPU-Cooler-1700-AM5/2022/16252.shtml
- DeepCool — AG620 (R-AG620-BKNNMN-G-1): https://www.deepcool.com/products/Cooling/cpuaircoolers/GAMMAXX-AG620-Dual-Tower-CPU-Cooler-1851-1700-AM5/2024/15900.shtml?pn=R-AG620-BKNNMN-G-1
- DeepCool — AK500 Zero Dark: https://global.deepcool.com/products/Cooling/cpuaircoolers/AK500-ZERO-DARK-High-Performance-CPU-Cooler-1700-AM5/2022/16396.shtml
- MSI — RTX 4070 Ti Ventus 3X 12G OC: https://br.msi.com/Graphics-Card/GeForce-RTX-4070-Ti-VENTUS-3X-12G-OC/Specification
- MSI — RTX 4070 Ti Super 16G Ventus 3X OC: https://br.msi.com/Graphics-Card/GeForce-RTX-4070-Ti-SUPER-16G-VENTUS-3X-OC/Specification
- MSI — RTX 4060 Ti Ventus 2X Black 8G OC: https://br.msi.com/Graphics-Card/GeForce-RTX-4060-Ti-VENTUS-2X-BLACK-8G-OC/Specification
- MSI — RTX 3060 Ventus 2X 12G OC: https://br.msi.com/Graphics-Card/GeForce-RTX-3060-VENTUS-2X-12G-OC/Specification
- Sapphire — Pulse RX 7900XTX: https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-7900-xtx-24g-gddr6
- Sapphire — Pulse RX 7800XT: https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-7800-xt-16g-gddr6
- Sapphire — Pulse RX 7700XT: https://www.sapphiretech.com/pt-br/consumer/pulse-radeon-rx-7700-xt-12g-gddr6
- Sapphire — Pulse RX 7600: https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-7600-8g-gddr6
- Sapphire — Pulse RX 6600: https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-6600-8g-gddr6
- Sapphire — Pulse RX 580: https://www.sapphiretech.com/en/consumer/pulse-rx-580-8g-g5
- ASUS ROG — tabela Z790-E Gaming WiFi: https://rog.asus.com/pl/motherboards/rog-strix/rog-strix-z790-e-gaming-wifi-model/helpdesk_qvl_cpu/
- ASRock — suporte ao i5-13600K: https://www.asrock.com/support/cpu.asp?s=1700&u=1347
- ASRock — suporte ao i7-13700K: https://www.asrock.com/support/cpu.ru.asp?s=1700&u=1348
- ASRock — suporte ao i9-14900K: https://www.asrock.com/support/cpu.de.asp?s=1700&u=1384
- ASUS — CPUs da TUF Gaming B550M-Plus: https://www.asus.com/br/supportonly/tuf%20gaming%20b550m-plus/helpdesk_cpu/
- ASUS — ficha da TUF Gaming B550M-Plus: https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b550m-plus/techspec/
- MSI — ficha A520M-A Pro: https://www.msi.com/Motherboard/A520M-A-PRO/Specification?form=MG0AV3
- Cooler Master — MasterBox Q300L: https://www.coolermaster.com/en-us/products/masterbox-q300l.html
- Corsair — manual do 4000D / 4000D Airflow: https://assets.corsair.com/image/upload/v1684779868/corsairmedia/sys_master/productcontent/WW_4000D_4000D_Airflow_QSG_AB.pdf
- Corsair — 4000D Airflow CC-9011200-WW: https://www.corsair.com/ww/en/p/pc-cases/cc-9011200-ww/40
- DeepCool — AK400: https://global.deepcool.com/products/Cooling/cpuaircoolers/AK400-Performance-CPU-Cooler-1700-AM5/2021/15222.shtml
- DeepCool — AK620: https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620-High-Performance-CPU-Cooler-1700-AM5/2021/13067.shtml
- MSI — RTX 4060 Ventus 2X Black 8G OC: https://br.msi.com/Graphics-Card/GeForce-RTX-4060-VENTUS-2X-BLACK-8G-OC/Specification
- NVIDIA — RTX 4090 Founders Edition: https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/
- MSI — MAG A550BN: https://us.msi.com/Power-Supply/MAG-A550BN/Specification
- MSI — MAG A750GL PCIE5: https://br.msi.com/Power-Supply/MAG-A750GL-PCIE5/Specification

Especificações regionais, lotes e revisões podem mudar. Dados ausentes permanecem desconhecidos, nunca zero. Os índices de desempenho e os benchmarks originais não foram auditados nesta etapa.
