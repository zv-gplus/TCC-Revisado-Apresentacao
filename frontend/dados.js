// Catálogo e jogos ilustrativos. Os preços não são atualizados automaticamente.
// perfScore é um índice do projeto; não substitui testes de cada aplicação.
// Referências declaradas no original: TechFuelHQ CPU/GPU Hierarchy 2026.
// As referências não foram auditadas nesta revisão. RAM, SSD e FPS usam estimativas.
const DB = {
  board: [
    { id:'asus-z790e-strix',   name:'ASUS ROG Strix Z790-E Gaming WiFi', brand:'ASUS', tier:'Flagship',   tdp:40, perfScore:95, socket:'LGA1700', formFactor:'ATX',        pcie:'PCIe 5.0', ramType:'DDR5', wifi:true },
    { id:'msi-b650-tomahawk',  name:'MSI B650 Tomahawk WiFi',            brand:'MSI',  tier:'High-End',   tdp:30, perfScore:85, socket:'AM5',     formFactor:'ATX',        pcie:'PCIe 4.0', ramType:'DDR5', wifi:true },
    { id:'asus-tuf-b550m',     name:'ASUS TUF Gaming B550M-Plus',        brand:'ASUS', tier:'Mid-Range',  tdp:25, perfScore:70,   socket:'AM4',     formFactor:'Micro-ATX',  pcie:'PCIe 4.0', ramType:'DDR4', wifi:false },
    { id:'msi-a520m-a-pro',    name:'MSI A520M-A Pro',                   brand:'MSI',  tier:'Entry',      tdp:15, perfScore:45,   socket:'AM4',     formFactor:'Micro-ATX',  pcie:'PCIe 3.0', ramType:'DDR4', wifi:false },
    { id:'asrock-b660m-phantom', name:'ASRock B660M Phantom Gaming 4',   brand:'ASRock', tier:'Mid-Range', tdp:20, perfScore:60,   socket:'LGA1700', formFactor:'Micro-ATX',  pcie:'PCIe 4.0', ramType:'DDR4', wifi:false },
  ],
  cpu: [
    { id:'ryzen9-7950x', name:'AMD Ryzen 9 7950X', brand:'AMD', tier:'Flagship', tdp:170, perfScore:71.0, cores:'16C/32T', freq:'4.5–5.7 GHz', cache:'64MB L3', socket:'AM5' },
    { id:'i9-14900k',    name:'Intel Core i9-14900K', brand:'Intel', tier:'Flagship', tdp:125, perfScore:78.2, cores:'24C(8P+16E)/32T', freq:'3.2–6.0 GHz', cache:'36MB L3', socket:'LGA1700' },
    { id:'ryzen7-7700x', name:'AMD Ryzen 7 7700X', brand:'AMD', tier:'High-End', tdp:105, perfScore:70.6, cores:'8C/16T', freq:'4.5–5.4 GHz', cache:'32MB L3', socket:'AM5' },
    { id:'i7-13700k',    name:'Intel Core i7-13700K', brand:'Intel', tier:'High-End', tdp:125, perfScore:75.8, cores:'16C(8P+8E)/24T', freq:'3.4–5.4 GHz', cache:'30MB L3', socket:'LGA1700' },
    { id:'ryzen5-7600x', name:'AMD Ryzen 5 7600X', brand:'AMD', tier:'Mid-Range', tdp:105, perfScore:67.3, cores:'6C/12T', freq:'4.7–5.3 GHz', cache:'32MB L3', socket:'AM5' },
    { id:'i5-13600k',    name:'Intel Core i5-13600K', brand:'Intel', tier:'Mid-Range', tdp:125, perfScore:70.9, cores:'14C(6P+8E)/20T', freq:'3.5–5.1 GHz', cache:'24MB L3', socket:'LGA1700' },
    { id:'ryzen5-5500',   name:'AMD Ryzen 5 5500',       brand:'AMD',   tier:'Entry', tdp:65, perfScore:41.2, cores:'6C/12T', freq:'3.6–4.2 GHz', cache:'16MB L3', socket:'AM4' },
    { id:'i3-12100f',     name:'Intel Core i3-12100F',   brand:'Intel', tier:'Entry', tdp:58, perfScore:43.3, cores:'4C/8T',  freq:'3.3–4.3 GHz', cache:'12MB L3', socket:'LGA1700' },
  ],
  gpu: [
    { id:'rtx4090',   name:'NVIDIA RTX 4090', brand:'NVIDIA', tier:'Flagship', tdp:450, perfScore:85.7, vram:'24GB GDDR6X', bus:'384-bit', cuda:'16384 CUDA' },
    { id:'rx7900xtx', name:'AMD RX 7900 XTX', brand:'AMD', tier:'Flagship', tdp:355, perfScore:73.1, vram:'24GB GDDR6', bus:'384-bit', cuda:'12288 SP' },
    { id:'rtx4070ti', name:'NVIDIA RTX 4070 Ti', brand:'NVIDIA', tier:'High-End', tdp:285, perfScore:58.6, vram:'12GB GDDR6X', bus:'192-bit', cuda:'7680 CUDA' },
    { id:'rx7800xt',  name:'AMD RX 7800 XT', brand:'AMD', tier:'High-End', tdp:263, perfScore:50.7, vram:'16GB GDDR6', bus:'256-bit', cuda:'3840 SP' },
    { id:'rtx4060',   name:'NVIDIA RTX 4060', brand:'NVIDIA', tier:'Mid-Range', tdp:115, perfScore:28.4, vram:'8GB GDDR6', bus:'128-bit', cuda:'3072 CUDA' },
    { id:'rx7600',    name:'AMD RX 7600', brand:'AMD', tier:'Mid-Range', tdp:165, perfScore:27.2, vram:'8GB GDDR6', bus:'128-bit', cuda:'2048 SP' },
    { id:'rtx4070tisuper', name:'NVIDIA RTX 4070 Ti Super 16GB', brand:'NVIDIA', tier:'High-End', tdp:285, perfScore:62.1, vram:'16GB GDDR6X', bus:'256-bit', cuda:'8448 CUDA' },
    { id:'rx7700xt',       name:'AMD RX 7700 XT 12GB',           brand:'AMD',    tier:'High-End', tdp:245, perfScore:43.4, vram:'12GB GDDR6',  bus:'192-bit', cuda:'3456 SP' },
    { id:'rtx4060ti',      name:'NVIDIA RTX 4060 Ti 8GB',        brand:'NVIDIA', tier:'Mid-Range', tdp:160, perfScore:35.2, vram:'8GB GDDR6',   bus:'128-bit', cuda:'4352 CUDA' },
    { id:'rx6600',         name:'AMD RX 6600 8GB',               brand:'AMD',    tier:'Entry',     tdp:132, perfScore:21.9, vram:'8GB GDDR6',   bus:'128-bit', cuda:'1792 SP' },
    { id:'rtx3060-12gb',  name:'NVIDIA RTX 3060 12GB', brand:'NVIDIA', tier:'Entry', tdp:170, perfScore:25.0, vram:'12GB GDDR6', bus:'192-bit', cuda:'3584 CUDA' },
    { id:'rx580-8gb',     name:'AMD RX 580 8GB',       brand:'AMD',    tier:'Entry', tdp:185, perfScore:11.6,   vram:'8GB GDDR5',  bus:'256-bit', cuda:'2304 SP' },
  ],
  ram: [
    { ramType:'DDR5', id:'ddr5-32gb-6000', name:'32GB DDR5 6000MHz', brand:'Generic', tier:'High-End', tdp:8, perfScore:95, capacity:'32GB (2x16GB)', freq:'6000MHz', latency:'CL36' },
    { ramType:'DDR5', id:'ddr5-16gb-5600', name:'16GB DDR5 5600MHz', brand:'Generic', tier:'Mid-Range', tdp:6, perfScore:80, capacity:'16GB (2x8GB)', freq:'5600MHz', latency:'CL40' },
    { ramType:'DDR4', id:'ddr4-32gb-3600', name:'32GB DDR4 3600MHz', brand:'Generic', tier:'High-End', tdp:7, perfScore:70, capacity:'32GB (2x16GB)', freq:'3600MHz', latency:'CL18' },
    { ramType:'DDR4', id:'ddr4-16gb-3200', name:'16GB DDR4 3200MHz', brand:'Generic', tier:'Entry', tdp:5, perfScore:55, capacity:'16GB (2x8GB)', freq:'3200MHz', latency:'CL22' },
    { ramType:'DDR5', id:'ddr5-64gb-6000-cl30',    name:'64GB (2x32GB) DDR5 6000MHz CL30 Corsair Vengeance', brand:'Corsair', tier:'Premium',   tdp:12, perfScore:98, capacity:'64GB (2x32GB)', freq:'6000MHz', latency:'CL30' },
    { ramType:'DDR4', id:'ddr4-16gb-3200-cl16-xpg', name:'16GB (1x16GB) DDR4 3200MHz CL16 XPG Spectrix D35G',      brand:'XPG',     tier:'Mid-Range', tdp:4,  perfScore:50,   capacity:'16GB (1x16GB)', freq:'3200MHz', latency:'CL16' },
    { ramType:'DDR4', id:'ddr4-8gb-3200-fury',   name:'8GB (1x8GB) DDR4 3200MHz CL16 Kingston Fury Beast', brand:'Kingston', tier:'Entry',     tdp:3, perfScore:40, capacity:'8GB (1x8GB)',  freq:'3200MHz', latency:'CL16' },
    { ramType:'DDR4', id:'ddr4-16gb-3200-gammix', name:'16GB (2x8GB) DDR4 3200MHz CL16 XPG Gammix D10',      brand:'XPG',      tier:'Mid-Range', tdp:5, perfScore:55, capacity:'16GB (2x8GB)', freq:'3200MHz', latency:'CL16' },
  ],
  ssd: [
    { id:'samsung-990pro-2tb', name:'Samsung 990 Pro 2TB NVMe', brand:'Samsung', tier:'Premium', tdp:7, perfScore:100, capacity:'2TB', interface:'NVMe PCIe 4.0', read:'7450MB/s' },
    { id:'wd-black-1tb',       name:'WD Black SN850X 1TB NVMe', brand:'WD', tier:'High-End', tdp:6, perfScore:88, capacity:'1TB', interface:'NVMe PCIe 4.0', read:'7300MB/s' },
    { id:'kingston-sata-1tb',  name:'Kingston A400 960GB SATA', brand:'Kingston', tier:'Entry', tdp:3, perfScore:40, capacity:'960GB', interface:'SATA III', read:'500MB/s' },
    { id:'seagate-hdd-2tb',    name:'Seagate Barracuda 2TB HD', brand:'Seagate', tier:'Entry', tdp:6, perfScore:20, capacity:'2TB', interface:'SATA III', read:'160MB/s' },
    { id:'kingston-kc3000-2tb', name:'Kingston KC3000 2TB NVMe M.2', brand:'Kingston', tier:'Premium',   tdp:7, perfScore:96, capacity:'2TB', interface:'NVMe PCIe 4.0', read:'7000MB/s' },
    { id:'crucial-p3plus-1tb', name:'Crucial P3 Plus 1TB NVMe M.2', brand:'Crucial', tier:'Mid-Range', tdp:5, perfScore:78,   capacity:'1TB', interface:'NVMe PCIe 4.0', read:'5000MB/s' },
    { id:'crucial-bx500-1tb',  name:'Crucial BX500 1TB SATA III',  brand:'Crucial', tier:'Entry',     tdp:3, perfScore:42,   capacity:'1TB', interface:'SATA III',      read:'540MB/s' },
    { id:'kingston-nv2-500gb', name:'Kingston NV2 500GB NVMe M.2', brand:'Kingston', tier:'Entry', tdp:4, perfScore:60, capacity:'500GB', interface:'NVMe PCIe 4.0', read:'3500MB/s' },
    { id:'adata-su650-480gb',  name:'Adata SU650 480GB SATA III',  brand:'Adata',    tier:'Entry', tdp:3, perfScore:35, capacity:'480GB', interface:'SATA III',      read:'520MB/s' },
  ],
  psu: [
    { id:'psu-1000w', name:'Corsair RM1000x (1000W)', brand:'Corsair', watts:1000, cert:'Gold' },
    { id:'psu-850w',  name:'EVGA SuperNOVA 850W', brand:'EVGA', watts:850, cert:'Gold' },
    { id:'psu-750w',  name:'Cooler Master MWE 750W', brand:'Cooler Master', watts:750, cert:'Bronze' },
    { id:'psu-650w',  name:'Seasonic Focus GX-650', brand:'Seasonic', watts:650, cert:'Gold' },
    { id:'psu-550w',  name:'Aerocool Lux 550W', brand:'Aerocool', watts:550, cert:'Bronze' },
    { id:'msi-a750gl-750w',    name:'MSI MAG A750GL 750W',    brand:'MSI',     watts:750, cert:'Gold' },
    { id:'corsair-cv650-650w', name:'Corsair CV650 650W',     brand:'Corsair', watts:650, cert:'Bronze' },
    { id:'msi-a550bn-550w',    name:'MSI MAG A550BN 550W',    brand:'MSI',     watts:550, cert:'Bronze' },
    { id:'mancer-thunder-500w', name:'Mancer Thunder 500W',      brand:'Mancer', watts:500, cert:'Bronze' },
    { id:'galax-omega-500w',    name:'Galax Omega GL500S 500W',  brand:'Galax',  watts:500, cert:'Bronze' },
  ]
};
const GAMES = [
  { name: 'Cyberpunk 2077',   icon: 'fa-solid fa-city',        preset: 'Ultra 4K',        baseFPS: 140, cpuWeight: 0.25, gpuWeight: 0.75 },
  { name: 'GTA V Enhanced',   icon: 'fa-solid fa-car-burst',   preset: 'Máx. 1440p',      baseFPS: 180, cpuWeight: 0.45, gpuWeight: 0.55 },
  { name: 'Counter-Strike 2', icon: 'fa-solid fa-crosshairs',  preset: 'Alto 1080p',      baseFPS: 400, cpuWeight: 0.60, gpuWeight: 0.40 },
  { name: "Baldur's Gate 3",  icon: 'fa-solid fa-dragon',      preset: 'Ultra 1440p',     baseFPS: 120, cpuWeight: 0.30, gpuWeight: 0.70 },
  { name: 'Alan Wake 2',      icon: 'fa-solid fa-flashlight',  preset: 'RT Ultra 1080p',  baseFPS: 100, cpuWeight: 0.20, gpuWeight: 0.80 },
];
