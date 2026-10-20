'use strict';

// Só permite links diretos para as lojas cadastradas. Nenhum dado salvo pelo
// visitante fornece preço, HTML ou endereço de loja para estas funções.
const STORE_HOSTS = {
  'Pichau': 'www.pichau.com.br',
  'KaBuM!': 'www.kabum.com.br',
  'TerabyteShop': 'www.terabyteshop.com.br'
};

function validOffer(offer) {
  if (!offer || !['quoted', 'unavailable'].includes(offer.status)) return false;
  if (!offer.product || !offer.sku || !offer.seller || !/^\d{4}-\d{2}-\d{2}$/.test(offer.checkedAt)) return false;
  const date = new Date(offer.checkedAt + 'T00:00:00Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== offer.checkedAt || date > new Date()) return false;
  if (offer.status === 'quoted' && (!Number.isSafeInteger(offer.priceCents) || offer.priceCents <= 0 || offer.priceCents > 100000000 || !offer.payment)) return false;
  try {
    const url = new URL(offer.url);
    return url.protocol === 'https:' && url.hostname === STORE_HOSTS[offer.store]
      && !url.username && !url.password && !url.port && !url.search && !url.hash
      && (offer.store === 'Pichau' ? /^\/[a-z0-9]+(?:-[a-z0-9]+)+$/.test(url.pathname) : /^\/produto\/\d+\/[a-z0-9-]+$/.test(url.pathname));
  } catch { return false; }
}

function getPartOffer(type, item, options = {}) {
  if (!item) return null;
  let id = item.id;
  if (type === 'gpu') {
    const variant = GPU_VARIANTS.find(model => model.id === options.gpuVariant && model.gpuId === item.id);
    if (!variant) return null;
    id = variant.id;
  }
  const offer = PRODUCT_OFFERS[type + ':' + id];
  return validOffer(offer) ? offer : null;
}

function offerDate(offer) {
  return offer.checkedAt.split('-').reverse().join('/');
}

function partPriceText(type, item, options = {}) {
  const offer = getPartOffer(type, item, options);
  return offer?.status === 'quoted' ? formatBRL(offer.priceCents / 100) : 'Preço não disponível';
}

function renderStoreOffer(type, item, options = {}) {
  const offer = getPartOffer(type, item, options);
  if (!offer) return '<div class="offer-details"><span>Preço não disponível</span><small>'
    + (type === 'gpu' && !options.gpuVariant ? 'Selecione o modelo exato para consultar a oferta cadastrada.' : 'Ainda não há uma oferta confirmada para este produto.') + '</small></div>';
  return `<div class="offer-details"><strong>${offer.status === 'quoted' ? formatBRL(offer.priceCents / 100) : 'Preço não disponível'}</strong>
    <span>${escapeHTML(offer.store)} · ${offer.status === 'quoted' ? escapeHTML(offer.payment) : 'Indisponível na consulta'}</span>
    <small>${escapeHTML(offer.product)} · ${escapeHTML(offer.sku)}</small>
    <small>Consulta: ${offerDate(offer)}${offer.seller !== offer.store ? ' · Vendido por ' + escapeHTML(offer.seller) : ''}</small>
    <a href="${escapeHTML(offer.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML('Ver ' + offer.product + ' na ' + offer.store)}">Ver na loja ↗</a></div>`;
}

function getBuildQuote(parts, options = {}) {
  const selected = Object.entries(parts).filter(([, item]) => item);
  let totalCents = 0;
  let priced = 0;
  for (const [type, item] of selected) {
    const offer = getPartOffer(type, item, options);
    if (offer?.status === 'quoted') { totalCents += offer.priceCents; priced++; }
  }
  return { totalCents, priced, selected: selected.length, missing: selected.length - priced };
}

function quoteAmount(quote) {
  return quote.selected && !quote.priced ? '—' : formatBRL(quote.totalCents / 100);
}

function quoteLabel(quote) {
  return quote.missing ? 'Subtotal com preços disponíveis' : 'Total das peças selecionadas';
}

function storeOfferText(type, item, options = {}) {
  const offer = getPartOffer(type, item, options);
  if (!offer) return 'Preço não disponível; sem oferta cadastrada para o modelo escolhido.';
  return [offer.product + ' (' + offer.sku + ')', offer.status === 'quoted' ? formatBRL(offer.priceCents / 100) + ' — ' + offer.payment : 'Preço não disponível — indisponível na consulta',
    'Loja: ' + offer.store + '; vendedor: ' + offer.seller, 'Consulta: ' + offerDate(offer), offer.url].join('\n');
}

// Referências técnicas são independentes dos preços cadastrados nas lojas.
const SOURCE_HOSTS = new Set(['amd.com','www.amd.com','www.intel.com','www.asus.com','rog.asus.com','www.asrock.com','www.msi.com','br.msi.com','us.msi.com','www.nvidia.com','www.sapphiretech.com','global.deepcool.com','www.deepcool.com','pt.deepcool.com','www.coolermaster.com','assets.corsair.com','www.corsair.com','www.kingston.com','www.xpg.com','download.semiconductor.samsung.com','www.sandisk.com','www.seagate.com','www.crucial.com','eu.crucial.com','webapi3.adata.com','www.evga.com','seasonic.com','aerocool.io','galax.com','www.pichau.com.br']);
function validSource(source) {
  try {
    const url = new URL(source.url);
    return Boolean(source.title && url.protocol === 'https:' && SOURCE_HOSTS.has(url.hostname) && !url.username && !url.password && !url.port);
  } catch { return false; }
}
function getProductSource(type, item, options = {}) {
  if (!item) return null;
  let key = PRODUCT_SOURCES[type + ':' + item.id] || item.source;
  let note = '';
  if (type === 'gpu') {
    const variant = GPU_VARIANTS.find(model => model.id === options.gpuVariant && model.gpuId === item.id);
    key = variant?.source || (item.brand === 'AMD' ? 'gpuAMD' : item.id === 'rtx3060-12gb' ? 'gpuNVIDIA3060' : 'gpuNVIDIA40');
    if (!variant) note = 'Referência do chip/família; selecione o modelo exato para consultar sua ficha.';
  }
  if (type === 'ram' && item.brand === 'Generic') {
    key = 'memoryTech';
    note = 'Configuração ilustrativa, sem marca ou SKU. O link explica a tecnologia; não identifica um produto à venda.';
  }
  if (type === 'ram' && ['ddr4-16gb-3200-gammix','ddr4-8gb-3200-fury'].includes(item.id)) note = 'Referência da família; confirme o SKU e o kit na loja.';
  if (type === 'psu' && ['psu-1000w','psu-850w','psu-750w','psu-650w'].includes(item.id)) note = 'Referência da família; revisão do catálogo não identificada. Não confirma dimensões nem conectores.';
  if (type === 'ssd' && item.id === 'seagate-hdd-2tb') note = 'Referência da família BarraCuda; revisão não identificada.';
  const source = OFFICIAL_SOURCES[key];
  return validSource(source) ? {...source, note} : null;
}
function renderProductSource(type, item, options = {}) {
  const source = getProductSource(type, item, options);
  if (!source) return '';
  return '<div class="product-source"><a href="' + escapeHTML(source.url) + '" target="_blank" rel="noopener noreferrer">Referência do produto ↗</a><span>' + escapeHTML(source.title) + '</span>' + (source.note ? '<small>' + escapeHTML(source.note) + '</small>' : '') + '</div>';
}
function renderOffer(type, item, options = {}) {
  return renderStoreOffer(type, item, options) + renderProductSource(type, item, options);
}
function offerText(type, item, options = {}) {
  const source = getProductSource(type, item, options);
  return storeOfferText(type, item, options) + (source ? '\nReferência: ' + source.title + '\n' + source.url + (source.note ? '\n' + source.note : '') : '');
}
