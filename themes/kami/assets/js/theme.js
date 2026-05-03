(function () {
  const stored = localStorage.getItem('kami-theme');
  const system = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = stored || system;
  document.documentElement.setAttribute('data-theme', theme);

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    const updateLabel = () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.textContent = dark ? '☼' : '☾';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    };
    updateLabel();
    btn.addEventListener('click', function () {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('kami-theme', next);
      updateLabel();
    });
  });
})();
