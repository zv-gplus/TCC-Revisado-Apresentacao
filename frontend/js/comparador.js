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
  selectA.innerHTML = '<option value="">— Escolha o Componente A —</option>' + options;
  selectB.innerHTML = '<option value="">— Escolha o Componente B —</option>' + options;
  for (const select of [selectA, selectB])
    select.closest(".compare-side").classList.add("is-empty");
}
// Mostra apenas índices do catálogo; não inventa notas de multicore ou ray tracing.
function getCompareMetrics(item) {
  return [
    {
      label: "Índice ilustrativo do catálogo",
      score: Math.max(0, Math.min(100, item.perfScore || 0)),
    },
  ];
}

function comparisonCard(item, type, side) {
  return `<article class="compare-header-card ${side}-card">
    <span class="eyebrow">Componente ${side === "left" ? "A" : "B"}</span>
    <h2 class="compare-name">${escapeHTML(item.name)}</h2>
    ${renderOffer(type, item)}
    <p class="component-detail">${escapeHTML(getExtraInfo(item, type))}</p>
    <div class="bar-label"><span>Índice ilustrativo do catálogo</span><span>${item.perfScore}/100</span></div>
    <div class="progress-track"><div class="progress-fill ${side}" style="width:${getCompareMetrics(item)[0].score}%"></div></div>
  </article>`;
}

function runComparison() {
  const area = document.getElementById("compare-result-area");
  const a = getItem(currentCompareType, document.getElementById("compare-left").value);
  const b = getItem(currentCompareType, document.getElementById("compare-right").value);
  document.getElementById("compare-left").closest(".compare-side").classList.toggle("is-empty", !a);
  document
    .getElementById("compare-right")
    .closest(".compare-side")
    .classList.toggle("is-empty", !b);
  if (!a || !b) {
    area.textContent = "";
    return;
  }
  if (a.id === b.id) {
    area.textContent = "Escolha duas peças diferentes para comparar.";
    return;
  }
  const offerA = getPartOffer(currentCompareType, a);
  const offerB = getPartOffer(currentCompareType, b);
  const bothPriced = offerA?.status === "quoted" && offerB?.status === "quoted";
  const priceText = bothPriced
    ? `Diferença entre os preços consultados: ${formatBRL(Math.abs(offerA.priceCents - offerB.priceCents) / 100)}. Condições e datas estão nas ofertas.`
    : "Não há duas ofertas confirmadas para comparar preços. Para GPUs, consulte o modelo exato no montador.";
  const indexDifference = Math.abs(a.perfScore - b.perfScore);
  const indexText =
    indexDifference < 0.000001
      ? "Mesmo índice no catálogo."
      : `O componente ${a.perfScore > b.perfScore ? "A" : "B"} tem índice ${indexDifference.toFixed(1).replace(".", ",")} pontos maior.`;
  area.innerHTML = `<div class="divider"></div><div class="comparison-results">${comparisonCard(a, currentCompareType, "left")}${comparisonCard(b, currentCompareType, "right")}</div>
    <div class="winner-banner">${escapeHTML(priceText)} ${escapeHTML(indexText)}</div>
    <p class="small muted">O índice é didático e não mede separadamente jogos, multitarefa, latência ou ray tracing. Ele não define sozinho qual peça vale mais a pena.</p>`;
}
