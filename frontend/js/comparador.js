"use strict";

// Comparação entre duas peças da mesma categoria.
let currentCompareType = "cpu";
function setCompareType(type, buttonEl) {
  if (!["cpu", "gpu", "ram", "ssd", "board"].includes(type)) return;
  currentCompareType = type;
  document.querySelectorAll(".type-btn").forEach((btn) => btn.classList.remove("active"));
  buttonEl.classList.add("active");
  buttonEl.parentElement
    ?.querySelectorAll("button")
    .forEach((button) => button.setAttribute("aria-pressed", String(button === buttonEl)));
  populateCompareSelects();
  document.getElementById("compare-result-area").innerHTML = "";
}
function populateCompareSelects() {
  const items = DB[currentCompareType];
  const selectA = document.getElementById("compare-left");
  const selectB = document.getElementById("compare-right");

  const options = items
    .map((item) => `<option value="${escapeHTML(item.id)}">${escapeHTML(item.name)}</option>`)
    .join("");
  const variants = currentCompareType === "gpu"
    ? '<optgroup label="Modelos físicos">' + GPU_VARIANTS.map((variant) =>
        `<option value="${escapeHTML(variant.id)}">${escapeHTML(variant.name)}</option>`,
      ).join("") + "</optgroup>"
    : "";
  selectA.innerHTML = '<option value="">— Escolha o Componente A —</option>' + options + variants;
  selectB.innerHTML = '<option value="">— Escolha o Componente B —</option>' + options + variants;
  for (const select of [selectA, selectB])
    select.closest(".compare-side").classList.add("is-empty");
}
// Índices aparecem apenas para peças com uma nota ilustrativa cadastrada.
function getCompareMetrics(item) {
  if (!Number.isFinite(item.perfScore)) return [];
  return [{ label: "Índice ilustrativo do catálogo", score: Math.max(0, Math.min(100, item.perfScore)) }];
}

function comparisonPart(type, id) {
  const variant = type === "gpu" ? GPU_VARIANTS.find((model) => model.id === id) : undefined;
  return { item: getItem(type, variant?.gpuId ?? id), variant };
}

function comparisonCard({ item, variant }, type, side) {
  const [metric] = getCompareMetrics(item);
  const indicator = metric
    ? `<div class="bar-label"><span>${metric.label}</span><span>${metric.score}/100</span></div>
       <div class="progress-track"><div class="progress-fill ${side}" style="width:${metric.score}%"></div></div>`
    : '<p class="small muted">Índice ilustrativo não cadastrado.</p>';
  return `<article class="compare-header-card ${side}-card">
    <span class="eyebrow">Componente ${side === "left" ? "A" : "B"}</span>
    <h2 class="compare-name">${escapeHTML(variant?.name ?? item.name)}</h2>
    ${renderOffer(type, item, { gpuVariant: variant?.id })}
    <p class="component-detail">${escapeHTML(getExtraInfo(item, type))}</p>
    ${indicator}
  </article>`;
}

function runComparison() {
  const area = document.getElementById("compare-result-area");
  const selectA = document.getElementById("compare-left");
  const selectB = document.getElementById("compare-right");
  const a = comparisonPart(currentCompareType, selectA.value);
  const b = comparisonPart(currentCompareType, selectB.value);
  selectA.closest(".compare-side").classList.toggle("is-empty", !a.item);
  selectB.closest(".compare-side").classList.toggle("is-empty", !b.item);
  if (!a.item || !b.item) {
    area.textContent = "";
    return;
  }
  if (selectA.value === selectB.value) {
    area.textContent = "Escolha duas peças diferentes para comparar.";
    return;
  }
  const offerA = getPartOffer(currentCompareType, a.item, { gpuVariant: a.variant?.id });
  const offerB = getPartOffer(currentCompareType, b.item, { gpuVariant: b.variant?.id });
  const bothPriced = offerA?.status === "quoted" && offerB?.status === "quoted";
  const priceText = bothPriced
    ? `Diferença entre os preços consultados: ${formatBRL(Math.abs(offerA.priceCents - offerB.priceCents) / 100)}. Condições e datas estão nas ofertas.`
    : "Não há duas ofertas confirmadas para comparar preços." +
      (currentCompareType === "gpu" && (!a.variant || !b.variant)
        ? " Para comparar preços de GPUs, escolha os modelos físicos." : "");
  const indexDifference = Math.abs(a.item.perfScore - b.item.perfScore);
  const indexText =
    !Number.isFinite(indexDifference)
      ? ""
      : indexDifference < 0.000001
      ? "Mesmo índice no catálogo."
      : `O componente ${a.item.perfScore > b.item.perfScore ? "A" : "B"} tem índice ${indexDifference.toFixed(1).replace(".", ",")} pontos maior.`;
  area.innerHTML = `<div class="divider"></div><div class="comparison-results">${comparisonCard(a, currentCompareType, "left")}${comparisonCard(b, currentCompareType, "right")}</div>
    <div class="winner-banner">${escapeHTML(priceText)} ${escapeHTML(indexText)}</div>
    <p class="small muted">O índice é didático e não mede separadamente jogos, multitarefa, latência ou ray tracing. Ele não define sozinho qual peça vale mais a pena.</p>`;
}
