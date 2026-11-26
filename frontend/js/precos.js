"use strict";

// Só permite links diretos para as lojas cadastradas. Nenhum dado salvo pelo
// visitante fornece preço, HTML ou endereço de loja para estas funções.
const STORE_HOSTS = {
  Pichau: "www.pichau.com.br",
  "KaBuM!": "www.kabum.com.br",
  TerabyteShop: "www.terabyteshop.com.br",
};

function validPriceDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value && date <= new Date();
}

function validPriceCents(value) {
  return Number.isSafeInteger(value) && value > 0 && value <= 100000000;
}

function validOffer(offer) {
  if (!offer || !["quoted", "unavailable"].includes(offer.status)) return false;
  if (!offer.product || !offer.sku || !offer.seller || !validPriceDate(offer.checkedAt)) return false;
  if (offer.status === "quoted" && (!validPriceCents(offer.priceCents) || !offer.payment))
    return false;
  return validStoreLink(offer);
}

function validStoreLink(offer) {
  try {
    const url = new URL(offer.url);
    return (
      url.protocol === "https:" &&
      url.hostname === STORE_HOSTS[offer.store] &&
      !url.username &&
      !url.password &&
      !url.port &&
      !url.search &&
      !url.hash &&
      (offer.store === "Pichau"
        ? /^\/[a-z0-9]+(?:-[a-z0-9]+)+$/.test(url.pathname)
        : /^\/produto\/\d+\/[a-z0-9-]+$/.test(url.pathname))
    );
  } catch {
    return false;
  }
}

function commercialKey(type, item, options) {
  if (!item) return null;
  let id = item.id;
  if (type === "gpu") {
    const variant = GPU_VARIANTS.find(
      (model) => model.id === options.gpuVariant && model.gpuId === item.id,
    );
    if (!variant) return null;
    id = variant.id;
  }
  return type + ":" + id;
}

function getPartOffer(type, item, options = {}) {
  const offer = PRODUCT_OFFERS[commercialKey(type, item, options)];
  return validOffer(offer) ? offer : null;
}

const REFERENCE_PAGES = new Map([
  ["Premium Informática", "https://www.premium.com.br/produto/hd-interno-2tb-7200rpm-barracuda-st2000dm001-seagate/"],
  ["Blast", "https://blastinfo.com.br/produto/placa-de-video-nvidia-rtx-4090-founders-edition-24gb/"],
]);

function validReferenceLink(source) {
  if (validStoreLink(source)) return true;
  try {
    const url = new URL(source.url);
    if (url.username || url.password || url.search || url.hash) return false;
    if (REFERENCE_PAGES.get(source.store) === url.href) return true;
    return source.store === "PromoTop" && url.origin === "https://promotop.net" &&
      /^\/placa-de-video-(?:[a-z0-9]+-)+[a-z0-9]+$/.test(url.pathname);
  } catch {
    return false;
  }
}

function validPriceReference(reference) {
  if (!reference || !validPriceCents(reference.priceCents) ||
      !validPriceDate(reference.checkedAt) || !reference.sku || !reference.note)
    return false;
  if (reference.kind === "historical") return validReferenceLink(reference);
  return reference.kind === "estimate" && Array.isArray(reference.sources) &&
    reference.sources.length >= 2 && reference.sources.every(validReferenceLink) &&
    new Set(reference.sources.map(({ url }) => url)).size >= 2;
}

function getPriceReference(type, item, options = {}) {
  const reference = PRODUCT_PRICE_REFERENCES[commercialKey(type, item, options)];
  return validPriceReference(reference) ? reference : null;
}

function priceReferenceLabel(reference) {
  return reference.kind === "historical"
    ? "Referência histórica — disponibilidade não confirmada"
    : "Estimativa de referência";
}

function missingValueReason(type, item, options, offer) {
  if (type === "gpu" && !options.gpuVariant) return "Escolha o modelo físico da placa.";
  const reason = PRODUCT_PRICE_GAPS[commercialKey(type, item, options)];
  if (reason) return reason;
  if (item?.brand === "Generic") return "Configuração sem SKU comercial confirmado.";
  if (offer?.status === "unavailable") return "Indisponível na consulta, sem valor documentado.";
  return "Nenhuma cotação ou referência confiável para este modelo foi confirmada.";
}

function offerDate(offer) {
  return offer.checkedAt.split("-").reverse().join("/");
}

function partPriceText(type, item, options = {}) {
  const offer = getPartOffer(type, item, options);
  if (offer?.status === "quoted") return formatBRL(offer.priceCents / 100);
  const reference = getPriceReference(type, item, options);
  return reference
    ? formatBRL(reference.priceCents / 100) + (reference.kind === "historical" ? " (histórico)" : " (estimado)")
    : "Valor não verificável";
}

function renderStoreOffer(type, item, options = {}) {
  const offer = getPartOffer(type, item, options);
  if (offer?.status !== "quoted") {
    const reference = getPriceReference(type, item, options);
    if (!reference) {
      const details = offer
        ? `<small>${escapeHTML(offer.product)} · ${escapeHTML(offer.sku)} · ${escapeHTML(offer.store)}</small>
           <a href="${escapeHTML(offer.url)}" target="_blank" rel="noopener noreferrer">Ver anúncio consultado ↗</a>`
        : "";
      return `<div class="offer-details"><strong>Valor não verificável</strong>
        <small>${escapeHTML(missingValueReason(type, item, options, offer))}</small>${details}</div>`;
    }
    const sources = reference.kind === "historical" ? [reference] : reference.sources;
    return `<div class="offer-details"><strong>${formatBRL(reference.priceCents / 100)}</strong>
      <span>${priceReferenceLabel(reference)}</span>
      <small>${escapeHTML(reference.sku)} · ${offerDate(reference)}</small>
      <small>${escapeHTML(reference.note)}</small>
      ${sources.map((source) => `<a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">Fonte: ${escapeHTML(source.store)} ↗</a>`).join("")}
    </div>`;
  }
  return `<div class="offer-details"><strong>${formatBRL(offer.priceCents / 100)}</strong>
    <span>${escapeHTML(offer.store)} · ${escapeHTML(offer.payment)}</span>
    <small>${escapeHTML(offer.product)} · ${escapeHTML(offer.sku)}</small>
    <small>Cotação observada em ${offerDate(offer)} · Vendido por ${escapeHTML(offer.seller)}</small>
    <a href="${escapeHTML(offer.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML("Ver " + offer.product + " na " + offer.store)}">Ver na loja ↗</a></div>`;
}

function getBuildQuote(parts, options = {}) {
  const selected = Object.entries(parts).filter(([, item]) => item);
  let totalCents = 0;
  let priced = 0;
  let referenceCents = 0;
  let referenced = 0;
  for (const [type, item] of selected) {
    const offer = getPartOffer(type, item, options);
    if (offer?.status === "quoted") {
      totalCents += offer.priceCents;
      priced++;
    } else {
      const reference = getPriceReference(type, item, options);
      if (reference) {
        referenceCents += reference.priceCents;
        referenced++;
      }
    }
  }
  return { totalCents, priced, selected: selected.length, missing: selected.length - priced, referenceCents, referenced };
}

function buildEstimateText(quote) {
  if (!quote.referenced) return "";
  const covered = quote.priced + quote.referenced;
  const label = covered === quote.selected
    ? "Estimativa de custo da montagem"
    : "Estimativa parcial de custo da montagem";
  return `${label}: ${formatBRL((quote.totalCents + quote.referenceCents) / 100)} (${covered} de ${quote.selected} peças selecionadas, inclui referências; sem frete).`;
}

function quoteAmount(quote) {
  return quote.selected && !quote.priced ? "—" : formatBRL(quote.totalCents / 100);
}

function quoteLabel(quote) {
  return quote.missing ? "Subtotal com preços disponíveis" : "Total com ofertas atuais";
}

function storeOfferText(type, item, options = {}) {
  const offer = getPartOffer(type, item, options);
  if (offer?.status !== "quoted") {
    const reference = getPriceReference(type, item, options);
    if (!reference) return "Valor não verificável — " + missingValueReason(type, item, options, offer);
    const sources = reference.kind === "historical" ? [reference] : reference.sources;
    return [
      priceReferenceLabel(reference) + ": " + formatBRL(reference.priceCents / 100),
      "SKU: " + reference.sku + " · Consulta: " + offerDate(reference),
      reference.note,
      ...sources.map((source) => "Fonte: " + source.store + " — " + source.url),
    ].join("\n");
  }
  return [
    offer.product + " (" + offer.sku + ")",
    formatBRL(offer.priceCents / 100) + " — " + offer.payment,
    "Loja: " + offer.store + "; vendedor: " + offer.seller,
    "Consulta: " + offerDate(offer),
    offer.url,
  ].join("\n");
}

// Referências técnicas são independentes dos preços cadastrados nas lojas.
const SOURCE_HOSTS = new Set([
  "amd.com",
  "www.amd.com",
  "www.intel.com",
  "www.asus.com",
  "rog.asus.com",
  "www.asrock.com",
  "www.msi.com",
  "br.msi.com",
  "us.msi.com",
  "www.nvidia.com",
  "www.sapphiretech.com",
  "global.deepcool.com",
  "www.deepcool.com",
  "pt.deepcool.com",
  "www.coolermaster.com",
  "assets.corsair.com",
  "www.corsair.com",
  "www.kingston.com",
  "images.teamgroupinc.com",
  "www.hiksemitech.com",
  "www.montechpc.com",
  "www.xpg.com",
  "download.semiconductor.samsung.com",
  "www.sandisk.com",
  "www.seagate.com",
  "www.crucial.com",
  "eu.crucial.com",
  "webapi3.adata.com",
  "www.evga.com",
  "seasonic.com",
  "aerocool.io",
  "galax.com",
  "www.pichau.com.br",
]);
function validSource(source) {
  try {
    const url = new URL(source.url);
    return Boolean(
      source.title &&
        url.protocol === "https:" &&
        SOURCE_HOSTS.has(url.hostname) &&
        !url.username &&
        !url.password &&
        !url.port,
    );
  } catch {
    return false;
  }
}
function getProductSource(type, item, options = {}) {
  if (!item) return null;
  let key = PRODUCT_SOURCES[type + ":" + item.id] || item.source;
  let note = "";
  if (type === "gpu") {
    const variant = GPU_VARIANTS.find(
      (model) => model.id === options.gpuVariant && model.gpuId === item.id,
    );
    key =
      variant?.source ||
      (item.brand === "AMD"
        ? "gpuAMD"
        : item.id === "rtx3060-12gb"
          ? "gpuNVIDIA3060"
          : "gpuNVIDIA40");
    if (!variant)
      note = "Referência do chip/família; selecione o modelo exato para consultar sua ficha.";
  }
  if (type === "ram" && item.brand === "Generic") {
    key = "memoryTech";
    note =
      "Configuração ilustrativa, sem marca ou SKU. O link explica a tecnologia; não identifica um produto à venda.";
  }
  if (type === "ram" && ["ddr4-16gb-3200-gammix", "ddr4-8gb-3200-fury"].includes(item.id))
    note = "Referência da família; confirme o SKU e o kit na loja.";
  if (type === "psu" && ["psu-850w", "psu-750w", "psu-650w"].includes(item.id))
    note =
      "Referência da família; revisão do catálogo não identificada. Não confirma dimensões nem conectores.";
  if (type === "psu" && item.id === "psu-1000w")
    note = "A revisão WW de 2021 é a referência comercial. Conectores não cadastrados para validação.";
  const source = OFFICIAL_SOURCES[key];
  return validSource(source) ? { ...source, note } : null;
}
function renderProductSource(type, item, options = {}) {
  const source = getProductSource(type, item, options);
  if (!source) return "";
  return (
    '<div class="product-source"><a href="' +
    escapeHTML(source.url) +
    '" target="_blank" rel="noopener noreferrer">Referência do produto ↗</a><span>' +
    escapeHTML(source.title) +
    "</span>" +
    (source.note ? "<small>" + escapeHTML(source.note) + "</small>" : "") +
    "</div>"
  );
}
function renderOffer(type, item, options = {}) {
  return renderStoreOffer(type, item, options) + renderProductSource(type, item, options);
}
function offerText(type, item, options = {}) {
  const source = getProductSource(type, item, options);
  return (
    storeOfferText(type, item, options) +
    (source
      ? "\nReferência: " +
        source.title +
        "\n" +
        source.url +
        (source.note ? "\n" + source.note : "")
      : "")
  );
}
