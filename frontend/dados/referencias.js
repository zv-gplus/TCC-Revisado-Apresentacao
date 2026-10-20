"use strict";

// Base ampliada com fichas oficiais em 19/10/2026.
// Dado ausente permanece desconhecido: não usar zero como substituto.
const OFFICIAL_SOURCES = {
  asus_7900xtx_tuf_oc: {
    title: "ASUS TUF Gaming RX 7900 XTX OC 24GB — ficha oficial",
    url: "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rx7900xtx-o24g-gaming/techspec/",
  },
  asus_7800xt_tuf_oc: {
    title: "ASUS TUF Gaming RX 7800 XT OC 16GB — ficha oficial",
    url: "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rx7800xt-o16g-gaming/techspec/",
  },
  asus_7700xt_dual_oc: {
    title: "ASUS Dual RX 7700 XT OC 12GB — ficha oficial",
    url: "https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rx7700xt-o12g/techspec/",
  },
  asus_7600_dual_oc: {
    title: "ASUS Dual RX 7600 OC 8GB — ficha oficial",
    url: "https://www.asus.com/uk/motherboards-components/graphics-cards/dual/dual-rx7600-o8g/techspec/",
  },
  asus_6600_dual: {
    title: "ASUS Dual RX 6600 8GB — ficha oficial",
    url: "https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rx6600-8g/techspec/",
  },
  msi_580_armor_oc: {
    title: "MSI RX 580 Armor 8G OC — ficha oficial",
    url: "https://www.msi.com/Graphics-Card/Radeon-RX-580-ARMOR-8G-OC/Specification",
  },
  asus_4090_tuf_oc: {
    title: "ASUS TUF Gaming RTX 4090 OC 24GB — ficha oficial",
    url: "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx4090-o24g-gaming/techspec/",
  },
  asus_4070ti_tuf_oc: {
    title: "ASUS TUF Gaming RTX 4070 Ti OC 12GB — ficha oficial",
    url: "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx4070ti-o12g-gaming/techspec/",
  },
  asus_4070tisuper_tuf_oc: {
    title: "ASUS TUF Gaming RTX 4070 Ti Super OC 16GB — ficha oficial",
    url: "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx4070tis-o16g-gaming/techspec/",
  },
  asus_4060_dual_oc: {
    title: "ASUS Dual RTX 4060 OC 8GB — ficha oficial",
    url: "https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx4060-o8g/techspec/",
  },
  asus_4060ti_dual_oc: {
    title: "ASUS Dual RTX 4060 Ti OC 8GB — ficha oficial",
    url: "https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx4060ti-o8g/techspec/",
  },
  asus_3060_dual_oc_v2: {
    title: "ASUS Dual RTX 3060 V2 OC 12GB — ficha oficial",
    url: "https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx3060-o12g-v2/techspec/",
  },
  b650Bios: {
    title: "MSI — BIOS e CPUs da MAG B650 Tomahawk WiFi",
    url: "https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/support",
  },
  a520Bios: {
    title: "MSI — BIOS e CPUs da A520M-A Pro",
    url: "https://www.msi.com/Motherboard/A520M-A-PRO/support",
  },
  ch370: {
    title: "DeepCool — CH370",
    url: "https://global.deepcool.com/products/Cases/CH370-Micro-ATX-Case/2022/15949.shtml",
  },
  cc560: {
    title: "DeepCool — CC560",
    url: "https://global.deepcool.com/products/Cases/fulltowercases/CC560-Mid-Tower-ATX-PC-Case/2021/15216.shtml",
  },
  cc560v2: {
    title: "DeepCool — CC560 V2",
    url: "https://www.deepcool.com/products/Cases/CC560-V2-Mid-Tower-Airflow-Case/2023/17782.shtml",
  },
  ch560: {
    title: "DeepCool — CH560",
    url: "https://www.deepcool.com/products/Cases/CH560-New-Generation-of-Airflow-Case/2023/17101.shtml",
  },
  ag400: {
    title: "DeepCool — AG400",
    url: "https://pt.deepcool.com/products/Cooling/cpuaircoolers/GAMMAXX-AG400-Single-Tower-CPU-Cooler-1700-AM5/2022/15935.shtml",
  },
  ag500: {
    title: "DeepCool — AG500 BK ARGB",
    url: "https://www.deepcool.com/products/Cooling/cpuaircoolers/AG500-BK-ARGB-Performance-CPU-Cooler-1700-AM5/2022/16252.shtml",
  },
  ag620: {
    title: "DeepCool — AG620 (R-AG620-BKNNMN-G-1)",
    url: "https://www.deepcool.com/products/Cooling/cpuaircoolers/GAMMAXX-AG620-Dual-Tower-CPU-Cooler-1851-1700-AM5/2024/15900.shtml?pn=R-AG620-BKNNMN-G-1",
  },
  ak500: {
    title: "DeepCool — AK500 Zero Dark",
    url: "https://global.deepcool.com/products/Cooling/cpuaircoolers/AK500-ZERO-DARK-High-Performance-CPU-Cooler-1700-AM5/2022/16396.shtml",
  },
  ventus4070ti: {
    title: "MSI — RTX 4070 Ti Ventus 3X 12G OC",
    url: "https://br.msi.com/Graphics-Card/GeForce-RTX-4070-Ti-VENTUS-3X-12G-OC/Specification",
  },
  ventus4070tisuper: {
    title: "MSI — RTX 4070 Ti Super 16G Ventus 3X OC",
    url: "https://br.msi.com/Graphics-Card/GeForce-RTX-4070-Ti-SUPER-16G-VENTUS-3X-OC/Specification",
  },
  ventus4060ti: {
    title: "MSI — RTX 4060 Ti Ventus 2X Black 8G OC",
    url: "https://br.msi.com/Graphics-Card/GeForce-RTX-4060-Ti-VENTUS-2X-BLACK-8G-OC/Specification",
  },
  ventus3060: {
    title: "MSI — RTX 3060 Ventus 2X 12G OC",
    url: "https://br.msi.com/Graphics-Card/GeForce-RTX-3060-VENTUS-2X-12G-OC/Specification",
  },
  pulse7900xtx: {
    title: "Sapphire — Pulse RX 7900XTX",
    url: "https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-7900-xtx-24g-gddr6",
  },
  pulse7800xt: {
    title: "Sapphire — Pulse RX 7800XT",
    url: "https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-7800-xt-16g-gddr6",
  },
  pulse7700xt: {
    title: "Sapphire — Pulse RX 7700XT",
    url: "https://www.sapphiretech.com/pt-br/consumer/pulse-radeon-rx-7700-xt-12g-gddr6",
  },
  pulse7600: {
    title: "Sapphire — Pulse RX 7600",
    url: "https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-7600-8g-gddr6",
  },
  pulse6600: {
    title: "Sapphire — Pulse RX 6600",
    url: "https://www.sapphiretech.com/en/consumer/pulse-radeon-rx-6600-8g-gddr6",
  },
  pulse580: {
    title: "Sapphire — Pulse RX 580",
    url: "https://www.sapphiretech.com/en/consumer/pulse-rx-580-8g-g5",
  },
  z790Bios: {
    title: "ASUS ROG — tabela Z790-E Gaming WiFi",
    url: "https://rog.asus.com/pl/motherboards/rog-strix/rog-strix-z790-e-gaming-wifi-model/helpdesk_qvl_cpu/",
  },
  asrock13600: {
    title: "ASRock — suporte ao i5-13600K",
    url: "https://www.asrock.com/support/cpu.asp?s=1700&u=1347",
  },
  asrock13700: {
    title: "ASRock — suporte ao i7-13700K",
    url: "https://www.asrock.com/support/cpu.ru.asp?s=1700&u=1348",
  },
  asrock14900: {
    title: "ASRock — suporte ao i9-14900K",
    url: "https://www.asrock.com/support/cpu.de.asp?s=1700&u=1384",
  },
  b550Bios: {
    title: "ASUS — CPUs da TUF Gaming B550M-Plus",
    url: "https://www.asus.com/br/supportonly/tuf%20gaming%20b550m-plus/helpdesk_cpu/",
  },
  b550: {
    title: "ASUS — ficha da TUF Gaming B550M-Plus",
    url: "https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b550m-plus/techspec/",
  },
  a520: {
    title: "MSI — ficha A520M-A Pro",
    url: "https://www.msi.com/Motherboard/A520M-A-PRO/Specification?form=MG0AV3",
  },
  q300l: {
    title: "Cooler Master — MasterBox Q300L",
    url: "https://www.coolermaster.com/en-us/products/masterbox-q300l.html",
  },
  corsair4000: {
    title: "Corsair — manual do 4000D / 4000D Airflow",
    url: "https://assets.corsair.com/image/upload/v1684779868/corsairmedia/sys_master/productcontent/WW_4000D_4000D_Airflow_QSG_AB.pdf",
  },
  corsairBoard: {
    title: "Corsair — 4000D Airflow CC-9011200-WW",
    url: "https://www.corsair.com/ww/en/p/pc-cases/cc-9011200-ww/40",
  },
  ak400: {
    title: "DeepCool — AK400",
    url: "https://global.deepcool.com/products/Cooling/cpuaircoolers/AK400-Performance-CPU-Cooler-1700-AM5/2021/15222.shtml",
  },
  ak620: {
    title: "DeepCool — AK620",
    url: "https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620-High-Performance-CPU-Cooler-1700-AM5/2021/13067.shtml",
  },
  ventus4060: {
    title: "MSI — RTX 4060 Ventus 2X Black 8G OC",
    url: "https://br.msi.com/Graphics-Card/GeForce-RTX-4060-VENTUS-2X-BLACK-8G-OC/Specification",
  },
  rtx4090fe: {
    title: "NVIDIA — RTX 4090 Founders Edition",
    url: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/",
  },
  a550bn: {
    title: "MSI — MAG A550BN",
    url: "https://us.msi.com/Power-Supply/MAG-A550BN/Specification",
  },
  a750gl: {
    title: "MSI — MAG A750GL PCIE5",
    url: "https://br.msi.com/Power-Supply/MAG-A750GL-PCIE5/Specification",
  },
};

// Referências do catálogo; não são ofertas nem comprovação dos índices ilustrativos.
Object.assign(OFFICIAL_SOURCES, {
  cpu7950: {
    title: "AMD Ryzen 9 7950X",
    url: "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7950x.html",
  },
  cpu7700: {
    title: "AMD Ryzen 7 7700X",
    url: "https://www.amd.com/pt/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7700x.html",
  },
  ryzen7000: {
    title: "AMD — Ryzen 7000",
    url: "https://www.amd.com/en/partner/articles/amd-ryzen-7000-series-desktop-processors.html",
  },
  cpu5500: {
    title: "AMD — suporte Ryzen 5 5500",
    url: "https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5500.html",
  },
  cpu14900: {
    title: "Intel Core i9-14900K",
    url: "https://www.intel.com/content/www/us/en/products/sku/236773/intel-core-i9-processor-14900k-36m-cache-up-to-6-00-ghz/specifications.html",
  },
  cpu13700: {
    title: "Intel Core i7-13700K",
    url: "https://www.intel.com/content/www/us/en/products/sku/230500/intel-core-i713700k-processor-30m-cache-up-to-5-40-ghz/specifications.html",
  },
  cpu13600: {
    title: "Intel Core i5-13600K",
    url: "https://www.intel.com/content/www/us/en/products/sku/230493/intel-core-i513600k-processor-24m-cache-up-to-5-10-ghz/specifications.html",
  },
  cpu12100: {
    title: "Intel Core i3-12100F",
    url: "https://www.intel.com/content/www/us/en/products/sku/132223/intel-core-i312100f-processor-12m-cache-up-to-4-30-ghz/specifications.html",
  },
  boardZ790: {
    title: "ASUS ROG Strix Z790-E Gaming WiFi",
    url: "https://rog.asus.com/motherboards/rog-strix/rog-strix-z790-e-gaming-wifi-model/spec/",
  },
  boardB650: {
    title: "MSI MAG B650 Tomahawk WiFi",
    url: "https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/Specification",
  },
  boardB660: {
    title: "ASRock B660M Phantom Gaming 4",
    url: "https://www.asrock.com/mb/Intel/B660M%20Phantom%20Gaming%204/index.asp",
  },
  gpuAMD: {
    title: "AMD — tabela de GPUs",
    url: "https://www.amd.com/en/products/specifications/graphics.html",
  },
  gpuNVIDIA40: {
    title: "NVIDIA — família RTX 40",
    url: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/",
  },
  gpuNVIDIA3060: {
    title: "NVIDIA — família RTX 3060",
    url: "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3060-3060ti/",
  },
  memoryTech: {
    title: "Kingston — tecnologias DDR4 e DDR5",
    url: "https://www.kingston.com/en/blog/pc-performance/ddr-memory-generation-differences",
  },
  vengeance64: {
    title: "Corsair Vengeance 64GB DDR5-6000 CL30",
    url: "https://www.corsair.com/br/pt/p/memory/cmk64gx5m2b6000c30/vengeance-64gb-2x32gb-ddr5-dram-6000mt-s-cl30-memory-kit-black-cmk64gx5m2b6000c30",
  },
  spectrix: {
    title: "XPG Spectrix D35G",
    url: "https://www.xpg.com/us/xpg/dram-modules-spectrix-d35g-rgb-ddr4?tab=spec",
  },
  gammix: {
    title: "XPG — referência à família Gammix D10",
    url: "https://www.xpg.com/il/news/116",
  },
  fury8: {
    title: "Kingston Fury Beast KF432C16BB/8",
    url: "https://www.kingston.com/datasheets/KF432C16BB_8.pdf",
  },
  samsung990: {
    title: "Samsung — ficha 990 Pro",
    url: "https://download.semiconductor.samsung.com/resources/data-sheet/samsung_nvme_ssd_990_pro_datasheet_rev.2.0.pdf",
  },
  sn850x: {
    title: "WD Black SN850X",
    url: "https://www.sandisk.com/products/ssd/internal-ssd/wd-black-sn850x-nvme-ssd",
  },
  a400: {
    title: "Kingston — A400 960GB",
    url: "https://www.kingston.com/datasheets/SA400_br.pdf",
  },
  barracuda: {
    title: "Seagate — família BarraCuda",
    url: "https://www.seagate.com/support/internal-hard-drives/desktop-hard-drives/barracuda-3-5/",
  },
  kc3000: {
    title: "Kingston KC3000",
    url: "https://www.kingston.com/datasheets/KC3000_br.pdf",
  },
  p3plus: {
    title: "Crucial P3 Plus CT1000P3PSSD8",
    url: "https://www.crucial.com/ssd/p3-plus/ct1000p3pssd8",
  },
  bx500: {
    title: "Crucial BX500 CT1000BX500SSD1",
    url: "https://eu.crucial.com/ssd/bx500/ct1000bx500ssd1",
  },
  nv2: {
    title: "Kingston — ficha NV2",
    url: "https://www.kingston.com/datasheets/SNV2S_br.pdf",
  },
  su650: {
    title: "ADATA — ficha SU650",
    url: "https://webapi3.adata.com/storage/downloadfile/datasheet_ultimate_su650_25_inch_sata_ssd_v2.pdf",
  },
  rm1000: {
    title: "Corsair RM1000x — referência 2021",
    url: "https://www.corsair.com/us/en/p/psu/cp-9020201-na/rmx-series-rm1000x-1000-watt-80-plus-gold-fully-modular-atx-psu-cp-9020201-na",
  },
  supernova: {
    title: "EVGA — família SuperNOVA G+",
    url: "https://www.evga.com/articles/archive/01185/evga-g-plus-power-supplies/default.asp",
  },
  mwe750: {
    title: "Cooler Master MWE Bronze 750 V3",
    url: "https://www.coolermaster.com/en-global/products/mwe-bronze-750-v3.html",
  },
  focus650: {
    title: "Seasonic — família Focus GX",
    url: "https://seasonic.com/focus-gx/",
  },
  lux550: {
    title: "Aerocool Lux 550W",
    url: "https://aerocool.io/product/lux-550w/",
  },
  cv650: {
    title: "Corsair CV650",
    url: "https://www.corsair.com/eu/en/p/psu/cp-9020211-eu/cv-series-cv650-650-watt-80-plus-bronze-certified-psu-cp-9020211-eu",
  },
  thunder: {
    title: "Pichau — Mancer Thunder 500W",
    url: "https://www.pichau.com.br/fonte-mancer-thunder-500w-bronze-80-plus-mcr-thr500-bl01",
  },
  gl500: {
    title: "GALAX Omega GL500S",
    url: "https://galax.com/pt/product/galax-omega-gl500s/",
  },
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
  "psu:galax-omega-500w": "gl500",
};
