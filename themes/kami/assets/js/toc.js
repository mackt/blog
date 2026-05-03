(function () {
  const toc = document.querySelector('.article-toc');
  if (!toc) return;

  const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  const headings = links
    .map(a => document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))))
    .filter(Boolean);

  if (!headings.length) return;

  const linkFor = (id) => toc.querySelector('a[href="#' + CSS.escape(id) + '"]');

  let active = null;
  const setActive = (id) => {
    if (active) active.classList.remove('active');
    const link = id ? linkFor(id) : null;
    if (link) {
      link.classList.add('active');
      active = link;
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      // Pick the topmost intersecting heading
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
  );

  headings.forEach(h => observer.observe(h));
})();
