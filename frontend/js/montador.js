"use strict";

// Seleções, orçamento, salvamento e resumo da montagem.
const BUILD_TYPES = ["board", "cpu", "gpu", "ram", "ssd", "psu", "case", "cooler"];
const PART_LABELS = {
  board: "Placa-mãe",
  cpu: "Processador",
  gpu: "Placa de vídeo",
  ram: "Memória",
  ssd: "Armazenamento",
  psu: "Fonte",
  case: "Gabinete",
  cooler: "Cooler",
};
const STORAGE_KEY = "ntj-builder-v1";
const EXAMPLE_BUILDS = {
  am4: {
    board: "asus-tuf-b550m",
    cpu: "ryzen5-5500",
    gpu: "rx6600",
    ram: "ddr4-16gb-3200",
    ssd: "kingston-nv2-500gb",
    psu: "msi-a550bn-550w",
    case: "q300l",
    cooler: "ak400",
  },
  am5: {
    board: "msi-b650-tomahawk",
    cpu: "ryzen5-7600x",
    gpu: "rtx4060",
    ram: "ddr5-32gb-6000",
    ssd: "crucial-p3plus-1tb",
    psu: "corsair-cv650-650w",
    case: "4000d-airflow",
    cooler: "ak620",
  },
};

function populateBuilderSelects() {
  for (const type of BUILD_TYPES) {
    const select = document.getElementById("build-" + type);
    select.options.length = 1;
    for (const item of DB[type])
      select.add(
        new Option(
          item.name +
            " · " +
            (type === "gpu" ? "escolha o modelo exato" : partPriceText(type, item)),
          item.id,
        ),
      );
  }
}
function calcFPS(cpu, gpu, game) {
  if (!cpu || !gpu) return null;
  const combinedScore = (cpu.perfScore * game.cpuWeight + gpu.perfScore * game.gpuWeight) / 100;
  return Math.round(game.baseFPS * combinedScore);
}
function fpsTier(fps) {
  if (fps >= 200) return { css: "fps-ultra", badge: "badge-ultra", label: "ULTRA" };
  if (fps >= 100) return { css: "fps-high", badge: "badge-high", label: "HIGH" };
  if (fps >= 60) return { css: "fps-mid", badge: "badge-mid", label: "MID" };
  return { css: "fps-low", badge: "badge-low", label: "LOW" };
}
function updateWattBadge(type, item) {
  const el = document.getElementById("watt-" + type);
  if (item && item.tdp > 0) {
    el.style.display = "block";
    el.querySelector("span").textContent = item.tdp;
  } else {
    el.style.display = "none";
  }
}
function updatePowerSection(board, cpu, gpu, ram, ssd, psu) {
  const totalWatts = getPowerEstimate({ board, cpu, gpu, ram, ssd });

  document.getElementById("power-total").textContent = totalWatts;

  const card = document.getElementById("power-card");
  const fill = document.getElementById("power-fill");
  const status = document.getElementById("power-status");
  const capacityLabel = document.getElementById("power-cap");

  card.className = "power-card";

  if (!psu) {
    capacityLabel.textContent = "— W";
    fill.style.width = "0%";
    card.classList.add("power-ok");
    status.innerHTML = `<span class="led led-ok"></span> Escolha uma fonte pra gente conferir se ela aguenta sua build.`;
    return;
  }

  const capacity = psu.watts;
  capacityLabel.textContent = capacity + " W";
  const usagePct = Math.min((totalWatts / capacity) * 100, 100);
  fill.style.width = usagePct + "%";

  if (totalWatts > capacity) {
    card.classList.add("power-danger");
    status.innerHTML = `<span class="led led-danger led-pulse"></span> O consumo estimado ultrapassa a potência cadastrada da fonte. Considere uma fonte de maior potência (faltam ${totalWatts - capacity}W).`;
  } else if (usagePct > 80) {
    card.classList.add("power-warn");
    status.innerHTML = `<span class="led led-warn led-pulse"></span> Atenção: a estimativa fica perto da potência da fonte (${Math.round(usagePct)}% de uso). Vale considerar uma margem maior. A estimativa não inclui todos os picos de consumo.`;
  } else {
    card.classList.add("power-ok");
    status.innerHTML = `<span class="led led-ok"></span> A potência cadastrada tem margem sobre o consumo estimado. Confira também conectores, qualidade da fonte e picos de consumo (${Math.round(usagePct)}% de uso, ${capacity - totalWatts}W de margem).`;
  }
}
function updateFpsSection(cpu, gpu) {
  const fpsArea = document.getElementById("fps-games-area");

  if (!cpu || !gpu) {
    fpsArea.innerHTML = `<div class="empty-state">Escolha a CPU e a GPU pra gente estimar o desempenho nos jogos</div>`;
    return;
  }

  fpsArea.innerHTML = GAMES.map((game) => {
    const fps = calcFPS(cpu, gpu, game);
    const tier = fpsTier(fps);
    const barPct = Math.min((fps / (game.baseFPS * 1.05)) * 100, 100);

    return `
      <div class="game-row ${tier.css}">
        <div class="game-header">
          <div class="game-name">${escapeHTML(game.name)}</div>
          <span class="fps-value">${fps}<span class="fps-unit">FPS</span></span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-family:var(--font-mono); font-size:10.5px; color:var(--silk-faint);">${escapeHTML(game.preset)}</span>
          <span class="fps-preset-badge ${tier.badge}">${tier.label}</span>
        </div>
        <div class="fps-bar-track"><div class="fps-bar-fill" style="width:${barPct}%"></div></div>
      </div>`;
  }).join("");
}
function updateSummaryTable(parts) {
  const selected = BUILD_TYPES.filter((type) => parts[type]);
  const options = readValidationOptions();
  const quote = getBuildQuote(parts, options);
  document.getElementById("build-summary").innerHTML = selected.length
    ? selected
        .map(
          (type) =>
            `<tr><td><span class="summary-category">${PART_LABELS[type]}</span><span class="summary-name">${escapeHTML(parts[type].name)}</span></td><td>${renderOffer(type, parts[type], options)}</td></tr>`,
        )
        .join("") +
      `<tr class="summary-total"><td>${quoteLabel(quote)}</td><td>${quoteAmount(quote)}</td></tr>`
    : '<tr><td colspan="2">Escolha suas peças para começar.</td></tr>';
}

// Um evento lê as escolhas, calcula e atualiza cada bloco uma única vez.
function updateBuild() {
  const parts = readBuildParts();
  syncValidationControls(parts);
  const checks = getExtendedChecks(parts, readValidationOptions());
  const issues = getCompatibilityIssues(parts.board, parts.cpu, parts.ram);
  for (const type of ["board", "cpu", "gpu", "ram", "ssd"]) updateWattBadge(type, parts[type]);
  updatePowerSection(parts.board, parts.cpu, parts.gpu, parts.ram, parts.ssd, parts.psu);
  updateSummaryTable(parts);
  updateBuilderDetails(parts, issues);
  refreshCompatibilityOptions(parts);
  updateOverview(parts);
  updateFpsSection(parts.cpu, parts.gpu);
  renderExtendedChecks(parts, checks);
}

function readBuildParts() {
  return Object.fromEntries(
    BUILD_TYPES.map((type) => [
      type,
      getItem(type, document.getElementById("build-" + type).value),
    ]),
  );
}

function updateBuilderDetails(parts, issues) {
  for (const type of BUILD_TYPES) {
    const select = document.getElementById("build-" + type);
    let detail = document.getElementById("detail-" + type);
    if (!detail) {
      detail = document.createElement("div");
      detail.id = "detail-" + type;
      detail.className = "component-detail";
      select.after(detail);
    }
    const item = parts[type];
    detail.innerHTML = item
      ? escapeHTML(type === "psu" ? item.watts + "W · " + item.cert : getExtraInfo(item, type)) +
        renderOffer(type, item, readValidationOptions())
      : "";
    select.title = item?.name || "";
    const invalid = issues.some((issue) => issue.field === type);
    select.setAttribute("aria-invalid", String(invalid));
    const row = select.closest(".component-row");
    row.classList.toggle("component-invalid", invalid);
    row.classList.toggle("component-empty", !item);
  }
}

// Mantém seleções existentes, inclusive quando a pessoa troca a plataforma.
function refreshCompatibilityOptions(parts) {
  const prevent = document.getElementById("compatible-only").checked;
  for (const type of ["board", "cpu", "ram"]) {
    const select = document.getElementById("build-" + type);
    for (const option of select.options) {
      const item = getItem(type, option.value);
      if (!item) continue;
      const candidate = { ...parts, [type]: item };
      const conflicts = getCompatibilityIssues(
        candidate.board,
        candidate.cpu,
        candidate.ram,
      ).filter((issue) => type === "board" || issue.field === type);
      option.disabled = prevent && conflicts.length > 0 && option.value !== select.value;
      const description =
        type === "board"
          ? item.socket + " / " + item.ramType
          : type === "cpu"
            ? item.socket
            : item.ramType;
      option.textContent =
        item.name +
        " · " +
        partPriceText(type, item) +
        " · " +
        description +
        (conflicts.length ? " — incompatível" : "");
    }
  }
}

function updateOverview(parts) {
  const selected = Object.values(parts).filter(Boolean);
  const quote = getBuildQuote(parts, readValidationOptions());
  const total = quote.totalCents / 100;
  document.getElementById("overview-total").textContent = quoteAmount(quote);
  document.getElementById("overview-price-label").textContent = quoteLabel(quote);
  document.getElementById("mobile-price-label").textContent = quote.missing
    ? "Subtotal parcial"
    : "Total consultado";
  document.getElementById("price-coverage").textContent = quote.selected
    ? `${quote.priced} de ${quote.selected} peças selecionadas com preço.${quote.missing ? " Faltam " + quote.missing + " preços; o subtotal não representa a montagem completa." : ""}`
    : "Escolha as peças para consultar as ofertas cadastradas.";
  document.getElementById("build-count").textContent =
    selected.length + " de " + BUILD_TYPES.length + " categorias escolhidas";
  document.getElementById("build-percent").textContent =
    Math.round((selected.length / BUILD_TYPES.length) * 100) + "%";
  const progress = document.getElementById("build-progress");
  progress.value = selected.length;
  progress.dataset.stage =
    selected.length === BUILD_TYPES.length
      ? "complete"
      : selected.length >= BUILD_TYPES.length / 2
        ? "half"
        : "start";
  progress.setAttribute(
    "aria-valuetext",
    selected.length +
      " de " +
      BUILD_TYPES.length +
      " categorias escolhidas; compatibilidade verificada separadamente.",
  );
  const budget = getBudget();
  const area = document.getElementById("budget-status");
  const valid = Number.isFinite(budget) && budget > 0 && budget <= 1000000;
  area.textContent =
    !valid || !quote.selected
      ? ""
      : total > budget
        ? (quote.missing ? "O subtotal já está acima do orçamento em " : "Acima do orçamento em ") +
          formatBRL(total - budget)
        : quote.missing
          ? "Há preços faltando. Ainda não é possível confirmar se a montagem cabe no orçamento."
          : "Restam " + formatBRL(budget - total) + " do orçamento, sem frete.";
  area.classList.toggle("over-budget", valid && total > budget);
}

function markUnsaved() {
  document.getElementById("save-status").textContent =
    "Alterações ainda não salvas neste navegador.";
}

// Só salva identificadores e orçamento. Nunca executa conteúdo vindo do armazenamento.
function getBudget() {
  const input = Number(document.getElementById("budget-limit").value);
  return Number.isFinite(input) && input > 0 && input <= 1000000 ? input : "";
}

function normalizeSavedBuild(raw) {
  if (!raw || raw.version !== 1 || !raw.parts || typeof raw.parts !== "object") return null;
  const parts = Object.fromEntries(
    BUILD_TYPES.map((type) => [type, getItem(type, raw.parts[type])?.id || ""]),
  );
  const budget = Number(raw.budget);
  return {
    parts,
    budget: Number.isFinite(budget) && budget > 0 && budget <= 1000000 ? budget : "",
    options: sanitizeValidationOptions(raw.options, parts),
  };
}

function applyBuild(parts, options = {}) {
  // Libera opções durante a troca conjunta; a validação é refeita no final.
  for (const type of BUILD_TYPES) {
    const select = document.getElementById("build-" + type);
    for (const option of select.options) option.disabled = false;
    select.value = getItem(type, parts[type])?.id || "";
  }
  syncValidationControls(readBuildParts());
  applyValidationOptions(options);
  updateBuild();
}

function exportBuildText(parts) {
  const options = readValidationOptions();
  const checks = getExtendedChecks(parts, options);
  const variant = GPU_VARIANTS.find(
    (item) => item.id === options.gpuVariant && item.gpuId === parts.gpu?.id,
  );
  const quote = getBuildQuote(parts, options);
  const stateLabels = {
    ok: "Sem conflito identificado",
    pending: "Precisa conferir",
    blocked: "Incompatível",
  };
  return [
    "NTJ Builder — Resumo da montagem",
    "",
    ...BUILD_TYPES.map(
      (type) =>
        PART_LABELS[type] +
        ": " +
        (parts[type]
          ? parts[type].name + "\n" + offerText(type, parts[type], options)
          : "Não selecionado"),
    ),
    "Modelo físico da GPU: " + (variant?.name || "Não informado"),
    "BIOS informada: " + (options.biosVersion || "Desconhecida"),
    "",
    quoteLabel(quote) + ": " + quoteAmount(quote),
    quote.priced +
      " de " +
      quote.selected +
      " peças com preço; " +
      quote.missing +
      " sem preço. Frete não incluído.",
    "Consumo estimado: " +
      getPowerEstimate(parts) +
      "W (ventoinhas incluídas na estimativa de acessórios)",
    ...getCompatibilityIssues(parts.board, parts.cpu, parts.ram).map(
      (issue) => "ATENÇÃO: " + issue.message,
    ),
    "",
    ...checks.map(
      (check) =>
        stateLabels[check.state] +
        " — " +
        check.label +
        ": " +
        check.message +
        check.sources
          .map((key) => OFFICIAL_SOURCES[key]?.url)
          .filter(Boolean)
          .map((url) => "\nFonte: " + url)
          .join(""),
    ),
    "",
    "Preços cadastrados manualmente; confirme valor e estoque na loja. FPS ilustrativos. Dimensões básicas não comprovam folgas de cabos, térmica, slots ou montagem completa.",
  ].join("\n");
}

function initBuilderTools() {
  document.getElementById("compatible-only").addEventListener("change", updateBuild);
  document.getElementById("budget-limit").addEventListener("input", () => {
    updateOverview(readBuildParts());
    markUnsaved();
  });
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      applyBuild(EXAMPLE_BUILDS[button.dataset.preset]);
      markUnsaved();
    });
  });
  document.getElementById("save-build").addEventListener("click", () => {
    const parts = Object.fromEntries(
      BUILD_TYPES.map((type) => [type, document.getElementById("build-" + type).value]),
    );
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          parts,
          budget: getBudget(),
          options: readValidationOptions(),
        }),
      );
      document.getElementById("save-status").textContent =
        "Montagem salva. Ela será recuperada ao abrir o site neste navegador.";
    } catch {
      document.getElementById("save-status").textContent =
        "O navegador não permitiu salvar. Você ainda pode baixar o resumo.";
    }
  });
  document.getElementById("clear-build").addEventListener("click", () => {
    document.getElementById("budget-limit").value = "";
    applyBuild({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      document.getElementById("save-status").textContent =
        "Tela limpa, mas o navegador não permitiu apagar a cópia salva.";
      return;
    }
    document.getElementById("save-status").textContent =
      "Montagem limpa. Você pode começar novamente ou carregar um exemplo.";
  });
  document.getElementById("export-build").addEventListener("click", () => {
    const blob = new Blob([exportBuildText(readBuildParts())], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "minha-montagem.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && raw.length > 20000) throw new Error("Dados salvos grandes demais");
    if (raw) {
      const saved = normalizeSavedBuild(JSON.parse(raw));
      if (!saved) throw new Error("Formato inválido");
      document.getElementById("budget-limit").value = saved.budget;
      applyBuild(saved.parts, saved.options);
      document.getElementById("save-status").textContent =
        "Sua montagem salva foi recuperada deste navegador.";
    }
  } catch {
    document.getElementById("save-status").textContent =
      "Não foi possível recuperar a montagem salva. Você pode começar outra.";
  }
}
