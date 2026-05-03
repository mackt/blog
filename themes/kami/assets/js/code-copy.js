(function () {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const block = btn.closest('.code-block');
    const codeEl = block && block.querySelector('code');
    if (!codeEl) return;
    const text = codeEl.innerText;
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(function () {
      const original = btn.dataset.label;
      btn.textContent = btn.dataset.done;
      btn.classList.add('copy-btn--done');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('copy-btn--done');
      }, 800);
    });
  });
})();
