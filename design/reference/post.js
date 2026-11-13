/* PFST — objava (referenca). Dodaci uz inner.js: traka napretka čitanja i "Kopiraj poveznicu". */
(() => {
  /* Copy link */
  const btn = document.querySelector('[data-copy]');
  const label = btn && btn.querySelector('[data-copy-label]');
  if (btn && label) {
    let t;
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(window.location.href); } catch (e) {}
      label.textContent = 'Poveznica kopirana';
      clearTimeout(t); t = setTimeout(() => { label.textContent = 'Kopiraj poveznicu'; }, 2200);
    });
  }

  /* Reading progress (scrubbed to the article) */
  const start = () => {
    const g = window.gsap, ST = window.ScrollTrigger;
    const bar = document.querySelector('[data-progress]'), art = document.querySelector('article');
    if (!g || !ST || !bar || !art) return;
    g.registerPlugin(ST);
    g.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      g.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: art, start: 'top 60%', end: 'bottom bottom', scrub: true } });
    });
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else window.addEventListener('load', start);
})();
