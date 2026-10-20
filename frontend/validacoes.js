'use strict';

// Cada linha tem um estado independente: ok, blocked ou pending.
// Nunca deduz a revisão da peça nem a BIOS instalada pelo nome comercial.
function getExtendedChecks(parts, options = {}) {
  const { board, cpu, gpu, psu, cooler } = parts;
  const chassis = parts.case;
  const variant = GPU_VARIANTS.find(item => item.id === options.gpuVariant && item.gpuId === gpu?.id);
  const supply = options.psuConfirmed ? PSU_SPECS[psu?.id] : null;
  const checks = [];
  const add = (id, label, state, message, sources = []) => checks.push({ id, label, state, message, sources });
  const fit = (id, label, size, limit, detail, sources) => {
    if (!Number.isFinite(size) || !Number.isFinite(limit)) add(id, label, 'pending', 'Faltam medidas confirmadas para esta comparação.', sources);
    else add(id, label, size > limit ? 'blocked' : 'ok', detail + ` ${size} mm; limite ${limit} mm.`, sources);
  };

  const bios = getBiosCheck(board, cpu, options.biosVersion);
  checks.push(bios);

  if (!board || !chassis) add('case-board', 'Placa-mãe no gabinete', 'pending', 'Selecione a placa-mãe e o gabinete.');
  else if (!Array.isArray(chassis.boardTypes) || !board.formFactor) add('case-board', 'Placa-mãe no gabinete', 'pending', 'Formato não confirmado para um dos modelos.');
  else add('case-board', 'Placa-mãe no gabinete', chassis.boardTypes.includes(board.formFactor) ? 'ok' : 'blocked', `${board.formFactor}; ${chassis.name} aceita ${chassis.boardTypes.join(', ')}.`, [chassis.source, chassis.id === '4000d-airflow' ? 'corsairBoard' : chassis.source]);

  if (!chassis || !gpu) add('case-gpu', 'Comprimento da GPU', 'pending', 'Selecione gabinete e GPU.');
  else if (!variant) add('case-gpu', 'Comprimento da GPU', 'pending', 'O chip não define o tamanho da placa. Informe um modelo exato com ficha cadastrada.');
  else fit('case-gpu', 'Comprimento da GPU', variant.length, chassis.maxGpuLength, variant.name + ':', [variant.source, chassis.source]);

  if (!cooler || !chassis) add('case-cooler', 'Altura do cooler', 'pending', 'Selecione gabinete e cooler.');
  else fit('case-cooler', 'Altura do cooler', cooler.height, chassis.maxCoolerHeight, cooler.name + ':', [cooler.source, chassis.source]);

  if (!cooler || !cpu) add('cooler-socket', 'Kit de montagem do cooler', 'pending', 'Selecione CPU e cooler.');
  else if (!Array.isArray(cooler.sockets)) add('cooler-socket', 'Kit de montagem do cooler', 'pending', 'Não há lista de soquetes confirmada.');
  else if (!cooler.sockets.includes(cpu.socket)) add('cooler-socket', 'Kit de montagem do cooler', 'blocked', `${cooler.name} não tem suporte cadastrado a ${cpu.socket}.`, [cooler.source]);
  else add('cooler-socket', 'Kit de montagem do cooler', options.coolerKitConfirmed ? 'ok' : 'pending', options.coolerKitConfirmed ? `Suporte a ${cpu.socket} na ficha; você confirmou que possui o kit desta versão.` : `A ficha inclui ${cpu.socket}, mas lotes antigos podem exigir outro kit. Confira os acessórios e marque a confirmação.`, [cooler.source]);

  if (!chassis || !psu) add('case-psu', 'Fonte no gabinete', 'pending', 'Selecione gabinete e fonte.');
  else if (!supply) add('case-psu', 'Fonte no gabinete', 'pending', 'Confirme uma fonte com modelo/revisão cadastrados para conferir formato e comprimento.');
  else if (!supply.type || !chassis.psuType) add('case-psu', 'Fonte no gabinete', 'pending', 'Formato de fonte não confirmado.');
  else if (supply.type !== chassis.psuType) add('case-psu', 'Fonte no gabinete', 'blocked', `Fonte ${supply.type}; gabinete aceita ${chassis.psuType}.`, [supply.source, chassis.source]);
  else fit('case-psu', 'Fonte no gabinete', supply.length, chassis.maxPsuLength, 'Formato ATX. Comprimento da fonte:', [supply.source, chassis.source]);

  const boardPower = BOARD_POWER[board?.id];
  if (!board || !psu || !boardPower || !supply) {
    add('power-board', 'Alimentação da placa-mãe', 'pending', 'Faltam a ficha de conectores da placa-mãe ou a confirmação da fonte. Ausência de dados não significa ausência de conectores.');
  } else if (![boardPower.atx24, boardPower.cpuConnections, supply.atx24, supply.eps44].every(Number.isFinite) || ![4, 8].includes(boardPower.cpuPinSize)) {
    add('power-board', 'Alimentação da placa-mãe', 'pending', 'Não há contagem completa de ATX/EPS para a comparação.');
  } else {
    const enough = supply.atx24 >= boardPower.atx24 && supply.eps44 >= boardPower.cpuConnections;
    add('power-board', 'Alimentação da placa-mãe', enough ? 'ok' : 'blocked', `Placa exige ${boardPower.atx24} ATX 24 pinos e ${boardPower.cpuConnections} conexão de CPU ${boardPower.cpuPinSize} pinos; a fonte oferece ${supply.atx24} ATX 24 pinos e ${supply.eps44} EPS 4+4. EPS de CPU e PCIe de GPU não são intercambiáveis.`, [boardPower.source, supply.source]);
  }

  if (!gpu || !psu || !variant || !supply) add('power-gpu', 'Alimentação da GPU', 'pending', 'Informe o modelo exato da GPU e confirme uma fonte com ficha de cabos cadastrada.');
  else if (variant.native16) {
    if (!Number.isFinite(variant.native16Watts)) {
      add('power-gpu', 'Alimentação da GPU', 'pending', 'A ficha confirma um conector de 16 pinos, mas a capacidade do cabo e o adaptador deste modelo ainda precisam ser conferidos no manual. Contar plugs não confirma essa ligação.', [variant.source, supply.source]);
    } else if (supply.native16 >= 1 && supply.native16Watts >= variant.native16Watts) {
      add('power-gpu', 'Alimentação da GPU', 'ok', `Conexão nativa de 16 pinos cadastrada para ${supply.native16Watts}W; modelo de GPU pede pelo menos ${variant.native16Watts}W nesse cabo. Use o cabo correto da própria fonte.`, [variant.source, supply.source]);
    } else {
      add('power-gpu', 'Alimentação da GPU', 'pending', `Não foi validado um cabo nativo de 16 pinos suficiente. O fabricante prevê adaptador com ${variant.adapter8} cabos PCIe de 8 pinos; quantidade de plugs não comprova cabos independentes, adaptador ou capacidade. Confira o manual.`, [variant.source, supply.source]);
    }
  } else if (!Number.isFinite(variant.pcie8) || !Number.isFinite(supply.pcie8)) add('power-gpu', 'Alimentação da GPU', 'pending', 'Contagem dos conectores PCIe não confirmada.');
  else add('power-gpu', 'Alimentação da GPU', supply.pcie8 >= variant.pcie8 ? 'ok' : 'blocked', `GPU exige ${variant.pcie8} PCIe de 8 pinos; fonte oferece ${supply.pcie8} conectores 6+2 cadastrados.`, [variant.source, supply.source]);

  if (parts.ssd?.interface?.includes('SATA')) {
    add('power-sata', 'Energia do armazenamento SATA', !supply || !Number.isFinite(supply.sata) ? 'pending' : supply.sata >= 1 ? 'ok' : 'blocked', supply ? `Fonte: ${supply.sata ?? 'quantidade desconhecida'} conectores de energia SATA; um dispositivo selecionado. Cabo de dados e porta da placa-mãe são conferidos separadamente no manual.` : 'A ficha da fonte ainda não foi confirmada.', supply ? [supply.source] : []);
  }
  if (variant && psu) {
    if (!Number.isFinite(variant.recommendedPsu)) add('gpu-psu-guidance', 'Potência sugerida pelo fabricante da GPU', 'pending', 'A recomendação de potência de sistema deste modelo ainda não foi cadastrada. Confira a ficha e o manual do fabricante.', [variant.source]);
    else add('gpu-psu-guidance', 'Potência sugerida pelo fabricante da GPU', psu.watts < variant.recommendedPsu ? 'pending' : 'ok', `${variant.name}: recomendação de sistema de ${variant.recommendedPsu}W; fonte selecionada de ${psu.watts}W. Isso é uma recomendação de referência e não substitui análise de carga e picos.`, [variant.source]);
  }

  if (chassis || cooler || gpu) add('assembly-details', 'Folgas e refrigeração', 'pending', 'Comprimento e altura não cobrem tudo: confira largura/slots da GPU, espaço e curvatura dos cabos, radiador frontal, altura da RAM sob o cooler e capacidade térmica. As medidas de gabinete consideram a configuração padrão.');
  return checks;
}

function getBiosCheck(board, cpu, installed) {
  const result = { id: 'bios', label: 'BIOS e suporte ao processador', state: 'pending', message: 'Selecione placa-mãe e processador.', sources: [] };
  if (!board || !cpu) return result;
  if (board.socket !== cpu.socket) return { ...result, state: 'blocked', message: 'Os soquetes são diferentes; atualizar a BIOS não resolve essa incompatibilidade.' };
  const rule = BIOS_RULES[board.id];
  const minimum = rule?.cpuMinimum[cpu.id];
  if (!minimum || !rule.versions.includes(minimum)) return { ...result, message: 'O soquete coincide, mas a versão mínima para este par exato ainda não foi confirmada na base. Consulte a lista oficial de CPUs.' };
  const source = rule.cpuSources?.[cpu.id] || rule.source;
  result.sources = [source];
  if (!installed || !rule.versions.includes(installed)) return { ...result, message: `${cpu.name} exige BIOS ${minimum} ou posterior neste modelo. Informe a versão instalada; ela não pode ser detectada por este site.` };
  const ready = rule.versions.indexOf(installed) >= rule.versions.indexOf(minimum);
  return { ...result, state: ready ? 'ok' : 'blocked', message: ready ? `BIOS informada ${installed} atende ao mínimo ${minimum} para ${cpu.name}. Isso verifica suporte de CPU, não se a BIOS é a mais recente ou contém todas as correções.` : `BIOS informada ${installed} é anterior à mínima ${minimum} para ${cpu.name}. A configuração exige revisão/atualização antes de usar a CPU; consulte o procedimento oficial.` };
}

function summarizeChecks(checks) {
  return checks.some(check => check.state === 'blocked') ? 'blocked' : checks.some(check => check.state === 'pending') ? 'pending' : 'ok';
}
