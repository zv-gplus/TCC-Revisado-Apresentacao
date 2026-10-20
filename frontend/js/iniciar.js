"use strict";

// Navegação e eventos são conectados depois de carregar os demais scripts.
function switchTab(tabName, buttonEl) {
  if (!["comparador", "builder"].includes(tabName)) return;
  document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll("nav button").forEach((btn) => btn.classList.remove("active"));

  document.getElementById("tab-" + tabName + "-content").classList.add("active");
  buttonEl.classList.add("active");
  document.body.classList.toggle("building", tabName === "builder");
  buttonEl.parentElement
    ?.querySelectorAll("button")
    .forEach((button) => button.setAttribute("aria-pressed", String(button === buttonEl)));
}

(function init() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab, button));
  });
  document.querySelectorAll("[data-compare-type]").forEach((button) => {
    button.addEventListener("click", () => setCompareType(button.dataset.compareType, button));
  });
  ["compare-left", "compare-right"].forEach((id) => {
    document.getElementById(id).addEventListener("change", runComparison);
  });
  document.querySelectorAll('select[id^="build-"]').forEach((select) => {
    select.addEventListener("change", () => {
      updateBuild();
      markUnsaved();
    });
  });
  populateCompareSelects();
  populateBuilderSelects();
  initExtendedValidation();
  initBuilderTools();
  initSharing();
  updateBuild();
})();
