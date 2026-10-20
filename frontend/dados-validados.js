'use strict';

// Base ampliada com fichas oficiais em 19/10/2026.
// Dado ausente permanece desconhecido: não usar zero como substituto.
const OFFICIAL_SOURCES = {
  asus_7900xtx_tuf_oc: {"title": "ASUS TUF Gaming RX 7900 XTX OC 24GB — ficha oficial", "url": "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rx7900xtx-o24g-gaming/techspec/"},
  asus_7800xt_tuf_oc: {"title": "ASUS TUF Gaming RX 7800 XT OC 16GB — ficha oficial", "url": "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rx7800xt-o16g-gaming/techspec/"},
  asus_7700xt_dual_oc: {"title": "ASUS Dual RX 7700 XT OC 12GB — ficha oficial", "url": "https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rx7700xt-o12g/techspec/"},
  asus_7600_dual_oc: {"title": "ASUS Dual RX 7600 OC 8GB — ficha oficial", "url": "https://www.asus.com/uk/motherboards-components/graphics-cards/dual/dual-rx7600-o8g/techspec/"},
  asus_6600_dual: {"title": "ASUS Dual RX 6600 8GB — ficha oficial", "url": "https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rx6600-8g/techspec/"},
  msi_580_armor_oc: {"title": "MSI RX 580 Armor 8G OC — ficha oficial", "url": "https://www.msi.com/Graphics-Card/Radeon-RX-580-ARMOR-8G-OC/Specification"},
  asus_4090_tuf_oc: {"title": "ASUS TUF Gaming RTX 4090 OC 24GB — ficha oficial", "url": "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx4090-o24g-gaming/techspec/"},
  asus_4070ti_tuf_oc: {"title": "ASUS TUF Gaming RTX 4070 Ti OC 12GB — ficha oficial", "url": "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx4070ti-o12g-gaming/techspec/"},
  asus_4070tisuper_tuf_oc: {"title": "ASUS TUF Gaming RTX 4070 Ti Super OC 16GB — ficha oficial", "url": "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx4070tis-o16g-gaming/techspec/"},
  asus_4060_dual_oc: {"title": "ASUS Dual RTX 4060 OC 8GB — ficha oficial", "url": "https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx4060-o8g/techspec/"},
  asus_4060ti_dual_oc: {"title": "ASUS Dual RTX 4060 Ti OC 8GB — ficha oficial", "url": "https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx4060ti-o8g/techspec/"},
  asus_3060_dual_oc_v2: {"title": "ASUS Dual RTX 3060 V2 OC 12GB — ficha oficial", "url": "https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx3060-o12g-v2/techspec/"},
  b650Bios: {"title": "MSI — BIOS e CPUs da MAG B650 Tomahawk WiFi", "url": "https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/support"},
  a520Bios: {"title": "MSI — BIOS e CPUs da A520M-A Pro", "url": "https://www.msi.com/Motherboard/A520M-A-PRO/support"},
  ch370: {"title": "DeepCool — CH370", "url": "https://global.deepcool.com/products/Cases/CH370-Micro-ATX-Case/2022/15949.shtml"},
  cc560: {"title": "DeepCool — CC560", "url": "https://global.deepcool.com/products/Cases/fulltowercases/CC560-Mid-Tower-ATX-PC-Case/2021/15216.shtml"},
  cc560v2: {"title": "DeepCool — CC560 V2", "url": "https://www.deepcool.com/products/Cases/CC560-V2-Mid-Tower-Airflow-Case/2023/17782.shtml"},
  ch560: {"title": "DeepCool — CH560", "url": "https://www.deepcool.com/products/Cases/CH560-New-Generation-of-Airflow-Case/2023/17101.shtml"},
  ag400: {"title": "DeepCool — AG400", "url": "https://pt.deepcool.com/products/Cooling/cpuaircoolers/GAMMAXX-AG400-Single-Tower-CPU-Cooler-1700-AM5/2022/15935.shtml"},
  ag500: {"title": "DeepCool — AG500 BK ARGB", "url": "https://www.deepcool.com/products/Cooling/cpuaircoolers/AG500-BK-ARGB-Performance-CPU-Cooler-1700-AM5/2022/16252.shtml"},
  ag620: {"title": "DeepCool — AG620 (R-AG620-BKNNMN-G-1)", "url": "https://www.deepcool.com/products/Cooling/cpuaircoolers/GAMMAXX-AG620-Dual-Tower-CPU-Cooler-1851-1700-AM5/2024/15900.shtml?pn=R-AG620-BKNNMN-G-1"},
  ak500: {"title": "DeepCool — AK500 Zero Dark", "url": "https://global.deepcool.com/products/Cooling/cpuaircoolers/AK500-ZERO-DARK-High-Performance-CPU-Cooler-1700-AM5/2022/16396.shtml"},
  ventus4070ti: {"title": "MSI — RTX 4070 Ti Ventus 3X 12G OC", "url": "https://br.msi.com/Graphics-Card/GeForce-RTX-4070-Ti-VENTUS-3X-12G-OC/Specification"},
  ventus4070tisuper: {"title": "MSI — RTX 4070 Ti Super 16G Ventus 3X OC", "url": "https://br.msi.com/Graphics-Card/GeForce-RTX-4070-Ti-SUPER-16G-VENTUS-3X-OC/Specification"},
  ventus4060ti: {"title": "MSI — RTX 4060 Ti Ventus 2X Black 8G OC", "url": "https://br.msi.com/Graphics-Card/GeForce-RTX-4060-Ti-VENTUS-2X-BLACK-8G-OC/Specification"},
  ventus3060: {"title": "MSI — RTX 3060 Ventus 2X 12G OC", "url": "https://br.msi.com/Graphics-Card/GeForce-RTX-3060-VENTUS-2X-12G-OC/Specification"},
  pulse7900xtx: {"title": "Sapphire — Pulse RX 7900XTX", "url": "https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-7900-xtx-24g-gddr6"},
  pulse7800xt: {"title": "Sapphire — Pulse RX 7800XT", "url": "https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-7800-xt-16g-gddr6"},
  pulse7700xt: {"title": "Sapphire — Pulse RX 7700XT", "url": "https://www.sapphiretech.com/pt-br/consumer/pulse-radeon-rx-7700-xt-12g-gddr6"},
  pulse7600: {"title": "Sapphire — Pulse RX 7600", "url": "https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-7600-8g-gddr6"},
  pulse6600: {"title": "Sapphire — Pulse RX 6600", "url": "https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-6600-8g-gddr6"},
  pulse580: {"title": "Sapphire — Pulse RX 580", "url": "https://www.sapphiretech.com/en/consumer/pulse-rx-580-8g-g5"},
  z790Bios: { title: 'ASUS ROG — tabela Z790-E Gaming WiFi', url: 'https://rog.asus.com/pl/motherboards/rog-strix/rog-strix-z790-e-gaming-wifi-model/helpdesk_qvl_cpu/' },
  asrock13600: { title: 'ASRock — suporte ao i5-13600K', url: 'https://www.asrock.com/support/cpu.asp?s=1700&u=1347' },
  asrock13700: { title: 'ASRock — suporte ao i7-13700K', url: 'https://www.asrock.com/support/cpu.ru.asp?s=1700&u=1348' },
  asrock14900: { title: 'ASRock — suporte ao i9-14900K', url: 'https://www.asrock.com/support/cpu.de.asp?s=1700&u=1384' },
  b550Bios: { title: 'ASUS — CPUs da TUF Gaming B550M-Plus', url: 'https://www.asus.com/br/supportonly/tuf%20gaming%20b550m-plus/helpdesk_cpu/' },
  b550: { title: 'ASUS — ficha da TUF Gaming B550M-Plus', url: 'https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b550m-plus/techspec/' },
  a520: { title: 'MSI — ficha A520M-A Pro', url: 'https://www.msi.com/Motherboard/A520M-A-PRO/Specification?form=MG0AV3' },
  q300l: { title: 'Cooler Master — MasterBox Q300L', url: 'https://www.coolermaster.com/en-us/products/masterbox-q300l.html' },
  corsair4000: { title: 'Corsair — manual do 4000D / 4000D Airflow', url: 'https://assets.corsair.com/image/upload/v1684779868/corsairmedia/sys_master/productcontent/WW_4000D_4000D_Airflow_QSG_AB.pdf' },
  corsairBoard: { title: 'Corsair — 4000D Airflow CC-9011200-WW', url: 'https://www.corsair.com/ww/en/p/pc-cases/cc-9011200-ww/40' },
  ak400: { title: 'DeepCool — AK400', url: 'https://global.deepcool.com/products/Cooling/cpuaircoolers/AK400-Performance-CPU-Cooler-1700-AM5/2021/15222.shtml' },
  ak620: { title: 'DeepCool — AK620', url: 'https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620-High-Performance-CPU-Cooler-1700-AM5/2021/13067.shtml' },
  ventus4060: { title: 'MSI — RTX 4060 Ventus 2X Black 8G OC', url: 'https://br.msi.com/Graphics-Card/GeForce-RTX-4060-VENTUS-2X-BLACK-8G-OC/Specification' },
  rtx4090fe: { title: 'NVIDIA — RTX 4090 Founders Edition', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/' },
  a550bn: { title: 'MSI — MAG A550BN', url: 'https://us.msi.com/Power-Supply/MAG-A550BN/Specification' },
  a750gl: { title: 'MSI — MAG A750GL PCIE5', url: 'https://br.msi.com/Power-Supply/MAG-A750GL-PCIE5/Specification' }
};

DB.case = [
  { id: 'q300l', name: 'Cooler Master MasterBox Q300L (MCB-Q300L-KANN-S00)', boardTypes: ['Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 159, maxPsuLength: 160, psuType: 'ATX', source: 'q300l' },
  { id: '4000d-airflow', name: 'Corsair 4000D Airflow (CC-9011200-WW)', boardTypes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 170, maxPsuLength: 220, psuType: 'ATX', source: 'corsair4000' },
  {"id": "ch370", "name": "DeepCool CH370", "boardTypes": ["Micro-ATX", "Mini-ITX"], "maxGpuLength": 378, "maxCoolerHeight": 165, "maxPsuLength": 160, "psuType": "ATX", "source": "ch370"},
  {"id": "cc560", "name": "DeepCool CC560", "boardTypes": ["ATX", "Micro-ATX", "Mini-ITX"], "maxGpuLength": 370, "maxCoolerHeight": 163, "maxPsuLength": 170, "psuType": "ATX", "source": "cc560"},
  {"id": "cc560v2", "name": "DeepCool CC560 V2", "boardTypes": ["ATX", "Micro-ATX", "Mini-ITX"], "maxGpuLength": 370, "maxCoolerHeight": 165, "maxPsuLength": 170, "psuType": "ATX", "source": "cc560v2"},
  {"id": "ch560", "name": "DeepCool CH560", "boardTypes": ["ATX", "Micro-ATX", "Mini-ITX"], "maxGpuLength": 380, "maxCoolerHeight": 175, "maxPsuLength": 170, "psuType": "ATX", "source": "ch560"}
];

DB.cooler = [
  { id: 'ak400', name: 'DeepCool AK400', height: 155, sockets: ['AM4', 'AM5', 'LGA1700'], source: 'ak400' },
  { id: 'ak620', name: 'DeepCool AK620', height: 160, sockets: ['AM4', 'AM5', 'LGA1700'], source: 'ak620' },
  {"id": "ag400", "name": "DeepCool AG400", "height": 150, "sockets": ["AM4", "AM5", "LGA1700"], "source": "ag400"},
  {"id": "ag500", "name": "DeepCool AG500 BK ARGB", "height": 155, "sockets": ["AM4", "AM5", "LGA1700"], "source": "ag500"},
  {"id": "ag620", "name": "DeepCool AG620 (R-AG620-BKNNMN-G-1)", "height": 157, "sockets": ["AM4", "AM5", "LGA1700"], "source": "ag620"},
  {"id": "ak500", "name": "DeepCool AK500 Zero Dark", "height": 158, "sockets": ["AM4", "AM5", "LGA1700"], "source": "ak500"}
];

// A escolha do chip não identifica o tamanho ou o conector de uma placa específica.
const GPU_VARIANTS = [
  { id: 'msi-4060-ventus-oc', gpuId: 'rtx4060', name: 'MSI RTX 4060 Ventus 2X Black 8G OC', length: 199, width: 120, thickness: 41, pcie8: 1, native16: 0, recommendedPsu: 550, source: 'ventus4060' },
  { id: 'nvidia-4090-fe', gpuId: 'rtx4090', name: 'NVIDIA RTX 4090 Founders Edition', length: 304, width: 137, thickness: 61, pcie8: 0, native16: 1, native16Watts: 450, adapter8: 3, recommendedPsu: 850, source: 'rtx4090fe' },
  {"id": "sapphire-7900xtx-pulse", "gpuId": "rx7900xtx", "name": "Sapphire Pulse RX 7900 XTX 24GB", "length": 313, "width": 133.75, "thickness": 52.67, "pcie8": 3, "native16": 0, "recommendedPsu": 800, "source": "pulse7900xtx"},
  {"id": "sapphire-7800xt-pulse", "gpuId": "rx7800xt", "name": "Sapphire Pulse RX 7800 XT 16GB", "length": 280, "width": 128.75, "thickness": 52.57, "pcie8": 2, "native16": 0, "recommendedPsu": 700, "source": "pulse7800xt"},
  {"id": "sapphire-7700xt-pulse", "gpuId": "rx7700xt", "name": "Sapphire Pulse RX 7700 XT 12GB", "length": 280, "width": 128.75, "thickness": 52.57, "pcie8": 2, "native16": 0, "recommendedPsu": 700, "source": "pulse7700xt"},
  {"id": "sapphire-7600-pulse", "gpuId": "rx7600", "name": "Sapphire Pulse RX 7600 8GB", "length": 240, "width": 107.1, "thickness": 44.07, "pcie8": 1, "native16": 0, "recommendedPsu": 550, "source": "pulse7600"},
  {"id": "sapphire-6600-pulse", "gpuId": "rx6600", "name": "Sapphire Pulse RX 6600 8GB", "length": 193, "width": 120.05, "thickness": 40.05, "pcie8": 1, "native16": 0, "recommendedPsu": 500, "source": "pulse6600"},
  {"id": "sapphire-580-pulse", "gpuId": "rx580-8gb", "name": "Sapphire Pulse RX 580 8GB", "length": 230, "width": 125, "thickness": 40, "pcie8": 1, "native16": 0, "recommendedPsu": 500, "source": "pulse580"},
  {"id": "msi-4070ti-ventus-oc", "gpuId": "rtx4070ti", "name": "MSI RTX 4070 Ti Ventus 3X 12G OC", "length": 308, "width": 123, "thickness": 52, "pcie8": 0, "native16": 1, "source": "ventus4070ti", "recommendedPsu": 700},
  {"id": "msi-4070tisuper-ventus-oc", "gpuId": "rtx4070tisuper", "name": "MSI RTX 4070 Ti Super 16G Ventus 3X OC", "length": 308, "width": 120, "thickness": 52, "pcie8": 0, "native16": 1, "source": "ventus4070tisuper", "recommendedPsu": 700},
  {"id": "msi-4060ti-ventus-oc", "gpuId": "rtx4060ti", "name": "MSI RTX 4060 Ti Ventus 2X Black 8G OC", "length": 199, "width": 120, "thickness": 42, "pcie8": 1, "native16": 0, "source": "ventus4060ti", "recommendedPsu": 550},
  {"id": "msi-3060-12gb-ventus-oc", "gpuId": "rtx3060-12gb", "name": "MSI RTX 3060 Ventus 2X 12G OC", "length": 235, "width": 124, "thickness": 42, "pcie8": 1, "native16": 0, "source": "ventus3060"},
  {"id": "asus-7900xtx-tuf-oc", "gpuId": "rx7900xtx", "name": "ASUS TUF Gaming RX 7900 XTX OC 24GB", "length": 352.9, "width": 158.2, "thickness": 72.6, "pcie8": 3, "native16": 0, "recommendedPsu": 850, "source": "asus_7900xtx_tuf_oc"},
  {"id": "asus-7800xt-tuf-oc", "gpuId": "rx7800xt", "name": "ASUS TUF Gaming RX 7800 XT OC 16GB", "length": 319.8, "width": 150.9, "thickness": 59.2, "pcie8": 2, "native16": 0, "recommendedPsu": 750, "source": "asus_7800xt_tuf_oc"},
  {"id": "asus-7700xt-dual-oc", "gpuId": "rx7700xt", "name": "ASUS Dual RX 7700 XT OC 12GB", "length": 279.9, "width": 133.9, "thickness": 49.3, "pcie8": 2, "native16": 0, "recommendedPsu": 750, "source": "asus_7700xt_dual_oc"},
  {"id": "asus-7600-dual-oc", "gpuId": "rx7600", "name": "ASUS Dual RX 7600 OC 8GB", "length": 245, "width": 134, "thickness": 49, "pcie8": 1, "native16": 0, "recommendedPsu": 550, "source": "asus_7600_dual_oc"},
  {"id": "asus-6600-dual", "gpuId": "rx6600", "name": "ASUS Dual RX 6600 8GB", "length": 243, "width": 134, "thickness": 49, "pcie8": 1, "native16": 0, "recommendedPsu": 500, "source": "asus_6600_dual"},
  {"id": "msi-580-armor-oc", "gpuId": "rx580-8gb", "name": "MSI RX 580 Armor 8G OC", "length": 269, "width": 125, "thickness": 38, "pcie8": 1, "native16": 0, "recommendedPsu": 500, "source": "msi_580_armor_oc"},
  {"id": "asus-4090-tuf-oc", "gpuId": "rtx4090", "name": "ASUS TUF Gaming RTX 4090 OC 24GB", "length": 348.2, "width": 150, "thickness": 72.6, "pcie8": 0, "native16": 1, "recommendedPsu": 850, "source": "asus_4090_tuf_oc"},
  {"id": "asus-4070ti-tuf-oc", "gpuId": "rtx4070ti", "name": "ASUS TUF Gaming RTX 4070 Ti OC 12GB", "length": 305, "width": 138, "thickness": 65, "pcie8": 0, "native16": 1, "recommendedPsu": 750, "source": "asus_4070ti_tuf_oc"},
  {"id": "asus-4070tisuper-tuf-oc", "gpuId": "rtx4070tisuper", "name": "ASUS TUF Gaming RTX 4070 Ti Super OC 16GB", "length": 305, "width": 138, "thickness": 65, "pcie8": 0, "native16": 1, "recommendedPsu": 750, "source": "asus_4070tisuper_tuf_oc"},
  {"id": "asus-4060-dual-oc", "gpuId": "rtx4060", "name": "ASUS Dual RTX 4060 OC 8GB", "length": 227.2, "width": 123.24, "thickness": 49.6, "pcie8": 1, "native16": 0, "recommendedPsu": 550, "source": "asus_4060_dual_oc"},
  {"id": "asus-4060ti-dual-oc", "gpuId": "rtx4060ti", "name": "ASUS Dual RTX 4060 Ti OC 8GB", "length": 227.2, "width": 123.24, "thickness": 49.6, "pcie8": 1, "native16": 0, "recommendedPsu": 650, "source": "asus_4060ti_dual_oc"},
  {"id": "asus-3060-dual-oc-v2", "gpuId": "rtx3060-12gb", "name": "ASUS Dual RTX 3060 V2 OC 12GB", "length": 200, "width": 123, "thickness": 38, "pcie8": 1, "native16": 0, "recommendedPsu": 650, "source": "asus_3060_dual_oc_v2"}
];

const BOARD_POWER = {
  'asus-tuf-b550m': { atx24: 1, cpuPinSize: 8, cpuConnections: 1, source: 'b550' },
  'msi-a520m-a-pro': { atx24: 1, cpuPinSize: 4, cpuConnections: 1, source: 'a520' }
};

// A versão/revisão da fonte precisa coincidir com a ficha consultada.
const PSU_SPECS = {
  'msi-a550bn-550w': { model: 'MSI MAG A550BN', atx24: 1, eps44: 1, pcie8: 2, native16: 0, sata: 5, length: 140, type: 'ATX', source: 'a550bn' },
  'msi-a750gl-750w': { model: 'MSI MAG A750GL PCIE5 (ficha regional 450W)', atx24: 1, eps44: 2, pcie8: 3, native16: 1, native16Watts: 450, sata: 8, length: 140, type: 'ATX', source: 'a750gl' }
};

// Versões documentadas em ordem de lançamento, da mais antiga para a mais nova.
// A lista não detecta a BIOS instalada nem garante que seja a mais recente.
const BIOS_RULES = {
  "msi-b650-tomahawk": {"versions": ["7D75v10", "7D75v11", "7D75v13", "7D75v14", "7D75v15", "7D75v16", "7D75v17", "7D75v1A", "7D75v1B", "7D75v1E", "7D75v1F", "7D75v1G", "7D75v1H", "7D75v1I", "7D75v1J", "7D75v1K", "7D75v1L", "7D75v1M3", "7D75v1M", "7D75v1N", "7D75v1O", "7D75v1P8", "7D75v1P", "7D75v1Q", "7D75v1R1", "7D75v1R2", "7D75v1R3"], "cpuMinimum": {"ryzen9-7950x": "7D75v10", "ryzen7-7700x": "7D75v10", "ryzen5-7600x": "7D75v10"}, "source": "b650Bios"},
  "msi-a520m-a-pro": {"versions": ["7C96v10", "7C96v11", "7C96v12", "7C96v13", "7C96v14", "7C96v15", "7C96v16", "7C96v17", "7C96v18", "7C96v19", "7C96v1A", "7C96v1B", "7C96v1C", "7C96v1D", "7C96v1E", "7C96v1G", "7C96v1H", "7C96v1I", "7C96v1J", "7C96v1K", "7C96v1L8", "7C96v1L9"], "cpuMinimum": {"ryzen5-5500": "7C96v19"}, "source": "a520Bios"},
  'asus-z790e-strix': {
    versions: ['1202', '1303', '1801', '2002'],
    cpuMinimum: { 'i9-14900k': '1202' },
    source: 'z790Bios'
  },
  'asrock-b660m-phantom': {
    versions: ['6.02', '10.02'],
    cpuMinimum: { 'i5-13600k': '6.02', 'i7-13700k': '6.02', 'i9-14900k': '10.02' },
    cpuSources: { 'i5-13600k': 'asrock13600', 'i7-13700k': 'asrock13700', 'i9-14900k': 'asrock14900' }
  },
  'asus-tuf-b550m': {
    versions: ['0318', '1401', '2423', '2803'],
    cpuMinimum: { 'ryzen5-5500': '2423' },
    source: 'b550Bios'
  }
};

// Referências do catálogo; não são ofertas nem comprovação dos índices ilustrativos.
Object.assign(OFFICIAL_SOURCES, {
  "cpu7950": {
    "title": "AMD Ryzen 9 7950X",
    "url": "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7950x.html"
  },
  "cpu7700": {
    "title": "AMD Ryzen 7 7700X",
    "url": "https://www.amd.com/pt/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7700x.html"
  },
  "ryzen7000": {
    "title": "AMD — Ryzen 7000",
    "url": "https://www.amd.com/en/partner/articles/amd-ryzen-7000-series-desktop-processors.html"
  },
  "cpu5500": {
    "title": "AMD — suporte Ryzen 5 5500",
    "url": "https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5500.html"
  },
  "cpu14900": {
    "title": "Intel Core i9-14900K",
    "url": "https://www.intel.com/content/www/us/en/products/sku/236773/intel-core-i9-processor-14900k-36m-cache-up-to-6-00-ghz/specifications.html"
  },
  "cpu13700": {
    "title": "Intel Core i7-13700K",
    "url": "https://www.intel.com/content/www/us/en/products/sku/230500/intel-core-i713700k-processor-30m-cache-up-to-5-40-ghz/specifications.html"
  },
  "cpu13600": {
    "title": "Intel Core i5-13600K",
    "url": "https://www.intel.com/content/www/us/en/products/sku/230493/intel-core-i513600k-processor-24m-cache-up-to-5-10-ghz/specifications.html"
  },
  "cpu12100": {
    "title": "Intel Core i3-12100F",
    "url": "https://www.intel.com/content/www/us/en/products/sku/132223/intel-core-i312100f-processor-12m-cache-up-to-4-30-ghz/specifications.html"
  },
  "boardZ790": {
    "title": "ASUS ROG Strix Z790-E Gaming WiFi",
    "url": "https://rog.asus.com/motherboards/rog-strix/rog-strix-z790-e-gaming-wifi-model/spec/"
  },
  "boardB650": {
    "title": "MSI MAG B650 Tomahawk WiFi",
    "url": "https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/Specification"
  },
  "boardB660": {
    "title": "ASRock B660M Phantom Gaming 4",
    "url": "https://www.asrock.com/mb/Intel/B660M%20Phantom%20Gaming%204/index.asp"
  },
  "gpuAMD": {
    "title": "AMD — tabela de GPUs",
    "url": "https://www.amd.com/en/products/specifications/graphics.html"
  },
  "gpuNVIDIA40": {
    "title": "NVIDIA — família RTX 40",
    "url": "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/"
  },
  "gpuNVIDIA3060": {
    "title": "NVIDIA — família RTX 3060",
    "url": "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3060-3060ti/"
  },
  "memoryTech": {
    "title": "Kingston — tecnologias DDR4 e DDR5",
    "url": "https://www.kingston.com/en/blog/pc-performance/ddr-memory-generation-differences"
  },
  "vengeance64": {
    "title": "Corsair Vengeance 64GB DDR5-6000 CL30",
    "url": "https://www.corsair.com/br/pt/p/memory/cmk64gx5m2b6000c30/vengeance-64gb-2x32gb-ddr5-dram-6000mt-s-cl30-memory-kit-black-cmk64gx5m2b6000c30"
  },
  "spectrix": {
    "title": "XPG Spectrix D35G",
    "url": "https://www.xpg.com/us/xpg/dram-modules-spectrix-d35g-rgb-ddr4?tab=spec"
  },
  "gammix": {
    "title": "XPG — referência à família Gammix D10",
    "url": "https://www.xpg.com/il/news/116"
  },
  "fury8": {
    "title": "Kingston Fury Beast KF432C16BB/8",
    "url": "https://www.kingston.com/datasheets/KF432C16BB_8.pdf"
  },
  "samsung990": {
    "title": "Samsung — ficha 990 Pro",
    "url": "https://download.semiconductor.samsung.com/resources/data-sheet/samsung_nvme_ssd_990_pro_datasheet_rev.2.0.pdf"
  },
  "sn850x": {
    "title": "WD Black SN850X",
    "url": "https://www.sandisk.com/products/ssd/internal-ssd/wd-black-sn850x-nvme-ssd"
  },
  "a400": {
    "title": "Kingston — A400 960GB",
    "url": "https://www.kingston.com/datasheets/SA400_br.pdf"
  },
  "barracuda": {
    "title": "Seagate — família BarraCuda",
    "url": "https://www.seagate.com/support/internal-hard-drives/desktop-hard-drives/barracuda-3-5/"
  },
  "kc3000": {
    "title": "Kingston KC3000",
    "url": "https://www.kingston.com/datasheets/KC3000_br.pdf"
  },
  "p3plus": {
    "title": "Crucial P3 Plus CT1000P3PSSD8",
    "url": "https://www.crucial.com/ssd/p3-plus/ct1000p3pssd8"
  },
  "bx500": {
    "title": "Crucial BX500 CT1000BX500SSD1",
    "url": "https://eu.crucial.com/ssd/bx500/ct1000bx500ssd1"
  },
  "nv2": {
    "title": "Kingston — ficha NV2",
    "url": "https://www.kingston.com/datasheets/SNV2S_br.pdf"
  },
  "su650": {
    "title": "ADATA — ficha SU650",
    "url": "https://webapi3.adata.com/storage/downloadfile/datasheet_ultimate_su650_25_inch_sata_ssd_v2.pdf"
  },
  "rm1000": {
    "title": "Corsair RM1000x — referência 2021",
    "url": "https://www.corsair.com/us/en/p/psu/cp-9020201-na/rmx-series-rm1000x-1000-watt-80-plus-gold-fully-modular-atx-psu-cp-9020201-na"
  },
  "supernova": {
    "title": "EVGA — família SuperNOVA G+",
    "url": "https://www.evga.com/articles/archive/01185/evga-g-plus-power-supplies/default.asp"
  },
  "mwe750": {
    "title": "Cooler Master MWE Bronze 750 V3",
    "url": "https://www.coolermaster.com/en-global/products/mwe-bronze-750-v3.html"
  },
  "focus650": {
    "title": "Seasonic — família Focus GX",
    "url": "https://seasonic.com/focus-gx/"
  },
  "lux550": {
    "title": "Aerocool Lux 550W",
    "url": "https://aerocool.io/product/lux-550w/"
  },
  "cv650": {
    "title": "Corsair CV650",
    "url": "https://www.corsair.com/eu/en/p/psu/cp-9020211-eu/cv-series-cv650-650-watt-80-plus-bronze-certified-psu-cp-9020211-eu"
  },
  "thunder": {
    "title": "Pichau — Mancer Thunder 500W",
    "url": "https://www.pichau.com.br/fonte-mancer-thunder-500w-bronze-80-plus-mcr-thr500-bl01"
  },
  "gl500": {
    "title": "GALAX Omega GL500S",
    "url": "https://galax.com/pt/product/galax-omega-gl500s/"
  }
});
const PRODUCT_SOURCES = {
  "board:asus-z790e-strix": "boardZ790",
  "board:msi-b650-tomahawk": "boardB650",
  "board:asus-tuf-b550m": "b550",
  "board:msi-a520m-a-pro": "a520",
  "board:asrock-b660m-phantom": "boardB660",
  "cpu:ryzen9-7950x": "cpu7950",
  "cpu:ryzen7-7700x": "cpu7700",
  "cpu:ryzen5-7600x": "ryzen7000",
  "cpu:ryzen5-5500": "cpu5500",
  "cpu:i9-14900k": "cpu14900",
  "cpu:i7-13700k": "cpu13700",
  "cpu:i5-13600k": "cpu13600",
  "cpu:i3-12100f": "cpu12100",
  "ram:ddr5-64gb-6000-cl30": "vengeance64",
  "ram:ddr4-16gb-3200-cl16-xpg": "spectrix",
  "ram:ddr4-8gb-3200-fury": "fury8",
  "ram:ddr4-16gb-3200-gammix": "gammix",
  "ssd:samsung-990pro-2tb": "samsung990",
  "ssd:wd-black-1tb": "sn850x",
  "ssd:kingston-sata-1tb": "a400",
  "ssd:seagate-hdd-2tb": "barracuda",
  "ssd:kingston-kc3000-2tb": "kc3000",
  "ssd:crucial-p3plus-1tb": "p3plus",
  "ssd:crucial-bx500-1tb": "bx500",
  "ssd:kingston-nv2-500gb": "nv2",
  "ssd:adata-su650-480gb": "su650",
  "psu:psu-1000w": "rm1000",
  "psu:psu-850w": "supernova",
  "psu:psu-750w": "mwe750",
  "psu:psu-650w": "focus650",
  "psu:psu-550w": "lux550",
  "psu:msi-a750gl-750w": "a750gl",
  "psu:msi-a550bn-550w": "a550bn",
  "psu:corsair-cv650-650w": "cv650",
  "psu:mancer-thunder-500w": "thunder",
  "psu:galax-omega-500w": "gl500"
};
