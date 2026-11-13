/* PFST — unutarnje stranice (referenca)
   GSAP 3.15 (ScrollTrigger, SplitText) + Lenis 1.3 — isti obrasci kao main.js na naslovnici */

(() => {
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* Sidebar: expand / collapse groups (works without animations) */
  $$('[data-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
      panel.style.display = open ? 'flex' : '';
      const chev = btn.querySelector('.chev');
      if (chev) chev.classList.toggle('is-open', open);
      if (!btn.classList.contains('is-on') && btn.classList.contains('s1')) btn.classList.toggle('is-open', open);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });

  const boot = () => {
    const g = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText, L = window.Lenis;
    if (!g || !ST) return;
    g.registerPlugin(ST);
    if (Split) g.registerPlugin(Split);
    const mm = g.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /* Smooth scroll */
      let lenis = null, tick = null;
      if (L) {
        lenis = new L({ lerp: 0.085, smoothWheel: true, anchors: true });
        lenis.on('scroll', ST.update);
        tick = (t) => lenis.raf(t * 1000);
        g.ticker.add(tick);
        g.ticker.lagSmoothing(0);
      }

      const box = document.querySelector('[data-hero-box]');
      const media = document.querySelector('[data-hero-media]');

      /* Hero intro */
      const intro = g.timeline({ defaults: { ease: 'expo.out' } });
      if (media) intro.from(media, { scale: 1.25, duration: 2 }, 0);
      intro.from('[data-hero-nav]', { y: -30, opacity: 0, duration: 1.2 }, 0.2);
      intro.from('[data-hero-fade]', { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.5);

      /* Split text: split → animate → revert */
      $$('[data-split]').forEach((el) => {
        const chars = el.dataset.split === 'chars';
        const inHero = !!el.closest('[data-hero-box]');
        if (!Split) {
          const v = { y: 36, opacity: 0, duration: 1.2, ease: 'expo.out' };
          if (inHero) intro.from(el, v, 0.3); else g.from(el, { ...v, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
          return;
        }
        const s = Split.create(el, { type: chars ? 'lines,chars' : 'lines', mask: 'lines', linesClass: 'sl' });
        const v = { yPercent: chars ? 110 : 105, rotate: chars ? 8 : 0, duration: chars ? 1.3 : 1.2, ease: 'expo.out', stagger: chars ? 0.025 : 0.1, onComplete: () => s.revert() };
        if (inHero) intro.from(chars ? s.chars : s.lines, v, 0.3);
        else g.from(chars ? s.chars : s.lines, { ...v, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });

      /* Reveals */
      $$('[data-fade]').forEach((el) => g.from(el, { y: 32, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
      $$('[data-stagger]').forEach((el) => g.from(el.children, { y: 60, opacity: 0, scale: 0.97, duration: 1.2, ease: 'expo.out', stagger: 0.06, clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
      $$('[data-img]').forEach((el) => {
        const inner = el.querySelector('.ph-inner');
        const tl = g.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' });
        if (inner) tl.fromTo(inner, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, '<0.15');
      });

      /* Hero parallax + floating nav */
      if (box && media) g.to(media, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: box, start: 'top top', end: 'bottom top', scrub: true } });
      const fn = document.querySelector('[data-float-nav]');
      if (fn && box) {
        g.set(fn, { y: 0, yPercent: -200 });
        ST.create({
          trigger: box, start: 'bottom 90',
          onEnter: () => g.to(fn, { yPercent: 0, duration: 0.8, ease: 'expo.out' }),
          onLeaveBack: () => g.to(fn, { yPercent: -200, duration: 0.5, ease: 'power3.in' })
        });
      }

      return () => { if (lenis) lenis.destroy(); if (tick) g.ticker.remove(tick); };
    });

    /* Reduced motion: floating nav still shown after the hero, without animation */
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const fn = document.querySelector('[data-float-nav]'), box = document.querySelector('[data-hero-box]');
      if (!fn || !box) return;
      ST.create({ trigger: box, start: 'bottom 90', onEnter: () => { fn.style.transform = 'none'; }, onLeaveBack: () => { fn.style.transform = ''; } });
    });

    ST.refresh();
  };

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
  else window.addEventListener('load', boot);
})();
