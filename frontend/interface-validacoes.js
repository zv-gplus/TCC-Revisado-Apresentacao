'use strict';

function readValidationOptions() {
  return {
    biosVersion: document.getElementById('bios-version').value,
    gpuVariant: document.getElementById('gpu-variant').value,
    psuConfirmed: document.getElementById('psu-model-confirmed').checked,
    coolerKitConfirmed: document.getElementById('cooler-kit-confirmed').checked
  };
}

function sanitizeValidationOptions(raw, parts) {
  return {
    biosVersion: BIOS_RULES[parts.board]?.versions.includes(raw?.biosVersion) ? raw.biosVersion : '',
    gpuVariant: GPU_VARIANTS.some(item => item.id === raw?.gpuVariant && item.gpuId === parts.gpu) ? raw.gpuVariant : '',
    psuConfirmed: Boolean(PSU_SPECS[parts.psu]) && raw?.psuConfirmed === true,
    coolerKitConfirmed: Boolean(getItem('cooler', parts.cooler)) && raw?.coolerKitConfirmed === true
  };
}

function syncValidationControls(parts) {
  const bios = document.getElementById('bios-version');
  if (bios.dataset.model !== (parts.board?.id || '')) {
    bios.dataset.model = parts.board?.id || '';
    bios.replaceChildren(new Option('Não sei a versão instalada', ''));
    for (const version of BIOS_RULES[parts.board?.id]?.versions || []) bios.add(new Option(version, version));
    bios.value = '';
  }
  const gpu = document.getElementById('gpu-variant');
  if (gpu.dataset.model !== (parts.gpu?.id || '')) {
    gpu.dataset.model = parts.gpu?.id || '';
    gpu.replaceChildren(new Option('Modelo exato não informado', ''));
    for (const item of GPU_VARIANTS.filter(item => item.gpuId === parts.gpu?.id)) gpu.add(new Option(item.name + ' · ' + partPriceText('gpu', parts.gpu, {gpuVariant:item.id}), item.id));
    gpu.value = '';
  }
  const modelCount = GPU_VARIANTS.filter(item => item.gpuId === parts.gpu?.id).length;
  document.getElementById('gpu-model-help').textContent = modelCount
    ? `${modelCount} modelos cadastrados para ${parts.gpu.name}. Selecione apenas o que corresponde à sua placa; se não estiver na lista, deixe sem informar. O preço acompanha o modelo exato; consumo e FPS continuam estimativas do chip.`
    : 'Ainda não há variante física confirmada para este chip; tamanho e alimentação ficarão pendentes.';
  const psu = document.getElementById('psu-model-confirmed');
  if (psu.dataset.model !== (parts.psu?.id || '')) { psu.dataset.model = parts.psu?.id || ''; psu.checked = false; }
  psu.disabled = !PSU_SPECS[parts.psu?.id];
  document.getElementById('psu-model-label').textContent = PSU_SPECS[parts.psu?.id]
    ? 'Confirmo que minha fonte e seus cabos correspondem a ' + PSU_SPECS[parts.psu.id].model
    : 'Modelo/revisão da fonte ainda sem ficha de conectores confirmada nesta base.';
  const kit = document.getElementById('cooler-kit-confirmed');
  const kitIdentity = (parts.cooler?.id || '') + '|' + (parts.cpu?.socket || '');
  if (kit.dataset.model !== kitIdentity) { kit.dataset.model = kitIdentity; kit.checked = false; }
  kit.disabled = !parts.cooler;
}

function applyValidationOptions(raw) {
  const parts = Object.fromEntries(BUILD_TYPES.map(type => [type, document.getElementById('build-' + type).value]));
  const safe = sanitizeValidationOptions(raw, parts);
  document.getElementById('bios-version').value = safe.biosVersion;
  document.getElementById('gpu-variant').value = safe.gpuVariant;
  document.getElementById('psu-model-confirmed').checked = safe.psuConfirmed;
  document.getElementById('cooler-kit-confirmed').checked = safe.coolerKitConfirmed;
}

function renderExtendedChecks(parts, checks) {
  const labels = { ok: 'Sem conflito identificado', blocked: 'Incompatível', pending: 'Precisa conferir' };
  document.getElementById('extended-checks').innerHTML = checks.map(check => {
    const sources = [...new Set(check.sources)].map(key => OFFICIAL_SOURCES[key]).filter(validSource);
    return `<article class="validation-row state-${check.state}"><div class="validation-row-heading"><strong>${escapeHTML(check.label)}</strong><span class="validation-badge">${labels[check.state]}</span></div><p>${escapeHTML(check.message)}</p>${sources.map(source => `<a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title)}</a>`).join(' · ')}</article>`;
  }).join('');
  const baseline = getCompatibilityIssues(parts.board, parts.cpu, parts.ram);
  const blocked = checks.filter(check => check.state === 'blocked');
  const pending = checks.filter(check => check.state === 'pending');
  const banner = document.getElementById('compatibility-status');
  const messages = [...baseline.map(issue => issue.message), ...blocked.filter(check => check.id !== 'bios' || !baseline.some(issue => issue.field === 'cpu')).map(check => check.message)];
  banner.className = 'compatibility-banner ' + (messages.length ? 'has-issues' : pending.length ? 'has-pending' : 'all-clear');
  const pendingText = pending.length === 1 ? '1 verificação precisa de confirmação.' : pending.length + ' verificações precisam de confirmação.';
  banner.innerHTML = `<strong>${messages.length ? 'Há conflitos que precisam ser resolvidos.' : pending.length ? 'Nenhum conflito confirmado; há verificações pendentes.' : 'Sem conflito identificado nas verificações cadastradas.'}</strong>${messages.slice(0, 3).map(text => `<p>${escapeHTML(text)}</p>`).join('')}<p>${pendingText} <a href="#validation-panel">Ver BIOS, dimensões e conectores</a>.</p>`;
  document.getElementById('mobile-total').textContent = document.getElementById('overview-total').textContent;
  if (messages.length) document.getElementById('fps-games-area').innerHTML = '<div class="fps-blocked"><strong>Resolva os conflitos confirmados antes de simular esta montagem.</strong>' + messages.map(message => '<p>' + escapeHTML(message) + '</p>').join('') + '</div>';
}

function initExtendedValidation() {
  for (const id of ['bios-version', 'gpu-variant', 'psu-model-confirmed', 'cooler-kit-confirmed']) {
    document.getElementById(id).addEventListener('change', () => { updateBuild(); markUnsaved(); });
  }
}
