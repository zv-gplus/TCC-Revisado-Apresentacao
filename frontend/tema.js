// Tema é uma preferência visual; não altera peças, preços ou registros.
(function () {
  const key = 'ntj-theme';
  const root = document.documentElement;
  const system = window.matchMedia?.('(prefers-color-scheme: dark)') || {matches: false};
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Sem armazenamento, funciona nesta visita. */ }
  let manual = saved === 'dark' || saved === 'light';
  let theme = manual ? saved : system.matches ? 'dark' : 'light';

  function apply() {
    root.dataset.theme = theme;
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    button.hidden = false;
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
    button.querySelector('.theme-label').textContent = theme === 'dark' ? 'Tema escuro' : 'Tema claro';
  }
  apply(); // Executa antes do CSS para evitar a tela clara ao abrir no modo escuro.
  function init() {
    apply();
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      manual = true;
      theme = theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, theme); } catch { /* A troca continua funcionando. */ }
      apply();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
  system.addEventListener?.('change', event => {
    if (!manual) { theme = event.matches ? 'dark' : 'light'; apply(); }
  });
})();
