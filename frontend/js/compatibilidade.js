"use strict";

// Regras locais: soquete e geração da memória. Não substituem a lista do fabricante.
function getCompatibilityIssues(board, cpu, ram) {
  const issues = [];
  if (board && cpu && board.socket !== cpu.socket) {
    issues.push({
      field: "cpu",
      message: `${cpu.name} usa ${cpu.socket}, mas ${board.name} usa ${board.socket}. Escolha um processador ${board.socket} ou troque a placa-mãe.`,
    });
  }
  if (board && ram && board.ramType !== ram.ramType) {
    issues.push({
      field: "ram",
      message: `${ram.name} é ${ram.ramType}, mas ${board.name} aceita ${board.ramType}. Troque a memória ou a placa-mãe.`,
    });
  }
  return issues;
}

function getPowerEstimate(parts) {
  const selected = ["board", "cpu", "gpu", "ram", "ssd"].some((type) => parts[type]);
  if (!selected) return 0;
  return (
    20 +
    (parts.board?.tdp ?? 30) +
    ["cpu", "gpu", "ram", "ssd"].reduce((sum, type) => sum + (parts[type]?.tdp ?? 0), 0)
  );
}

function getPowerLevel(watts, capacity) {
  if (!capacity) return "pending";
  if (watts > capacity) return "danger";
  return watts / capacity > 0.8 ? "warn" : "ok";
}
