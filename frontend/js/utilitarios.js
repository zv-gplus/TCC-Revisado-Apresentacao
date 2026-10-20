"use strict";

// Busca uma peça pelo tipo e pelo identificador selecionado.
function getItem(type, id) {
  if (!id) return null;
  return Object.hasOwn(DB, type) && Array.isArray(DB[type])
    ? DB[type].find((item) => item.id === id) || null
    : null;
}
const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
function formatBRL(value) {
  return currencyFormatter.format(value);
}

// Escapa textos do catálogo antes de colocá-los em trechos de HTML.
function escapeHTML(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}
function getExtraInfo(item, type) {
  if (type === "case")
    return (
      item.boardTypes.join(", ") +
      " · GPU até " +
      item.maxGpuLength +
      "mm · cooler até " +
      item.maxCoolerHeight +
      "mm"
    );
  if (type === "cooler") return item.height + "mm · " + item.sockets.join(", ");
  if (type === "board")
    return `${item.formFactor} • Socket ${item.socket} • ${item.pcie} • ${item.ramType}${item.wifi ? " • Wi-Fi" : ""}`;
  if (type === "cpu")
    return `${item.cores} • ${item.freq} • Socket ${item.socket} • TDP ${item.tdp}W`;
  if (type === "gpu") return `${item.vram} • Barramento ${item.bus} • TDP ${item.tdp}W`;
  if (type === "ram") return `${item.capacity} • ${item.freq} • ${item.latency}`;
  if (type === "ssd") return `${item.capacity} • ${item.interface} • ${item.read}`;
  return "";
}
