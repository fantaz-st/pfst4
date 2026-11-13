/* PFST — Početna
   GSAP 3.15 (ScrollTrigger, SplitText) + Lenis 1.3 */

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ------------------------------------------------------------------
     News filter + "show more" (works without animations)
     ------------------------------------------------------------------ */
  const initNews = () => {
    const tabs = $$('[data-news-tabs] [data-filter]');
    const rows = $$('[data-news-list] .nrow');
    const moreWrap = $('[data-news-more-wrap]');
    const moreBtn = $('[data-news-more]');
    const PAGE = 7;
    let filter = 'Sve';
    let expanded = false;

    const render = () => {
      const matching = rows.filter((r) => filter === 'Sve' || r.dataset.cat === filter);
      rows.forEach((r) => { r.hidden = true; r.classList.remove('is-last'); });
      const visible = expanded ? matching : matching.slice(0, PAGE);
      visible.forEach((r) => { r.hidden = false; });
      if (visible.length) visible[visible.length - 1].classList.add('is-last');
      if (moreWrap) moreWrap.hidden = expanded || matching.length <= PAGE;
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };

    tabs.forEach((t) => t.addEventListener('click', () => {
      filter = t.dataset.filter;
      expanded = false;
      tabs.forEach((x) => {
        const on = x === t;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render();
    }));
    if (moreBtn) moreBtn.addEventListener('click', () => { expanded = true; render(); });
    render();
  };

  /* ------------------------------------------------------------------
     Smooth scroll
     ------------------------------------------------------------------ */
  let lenis = null;
  const initLenis = () => {
    if (!window.Lenis) return;
    lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  };

  /* ------------------------------------------------------------------
     Motion
     ------------------------------------------------------------------ */
  const initMotion = () => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const mm = gsap.matchMedia();

    mm.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 901px)',
      hover: '(hover: hover)'
    }, (ctx) => {
      const { motion, desktop, hover } = ctx.conditions;
      if (!motion) return;

      const heroBox = $('[data-hero-box]');
      const media = $('[data-hero-media]');

      /* Hero intro */
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      if (media) intro.from(media, { scale: 1.3, duration: 2.2 }, 0);
      intro.from('[data-hero-nav]', { y: -30, opacity: 0, duration: 1.2 }, 0.3);
      intro.from('[data-hero-fade]', { y: 28, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.75);

      /* Split-text reveals: split → animate → revert */
      $$('[data-split]').forEach((el) => {
        const mode = el.dataset.split;
        if (mode === 'words-scrub') return;
        const chars = mode === 'chars';
        const split = SplitText.create(el, { type: chars ? 'lines,chars' : 'lines', mask: 'lines', linesClass: 'sl' });
        const vars = {
          yPercent: chars ? 110 : 105,
          rotate: chars ? 8 : 0,
          duration: chars ? 1.3 : 1.2,
          ease: 'expo.out',
          stagger: chars ? 0.022 : 0.1,
          onComplete: () => split.revert()
        };
        const targets = chars ? split.chars : split.lines;
        if (el.closest('[data-hero]')) intro.from(targets, vars, 0.35);
        else gsap.from(targets, { ...vars, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });

      /* Fade-ups + staggered groups */
      $$('[data-fade]').forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });
      $$('[data-stagger]').forEach((el) => {
        gsap.from(el.children, { y: 70, opacity: 0, scale: 0.96, duration: 1.2, ease: 'expo.out', stagger: 0.07, clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });

      /* Image reveal: curtain wipe + inner zoom-out */
      $$('[data-img]').forEach((el) => {
        const inner = $('.ph-inner', el);
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' });
        if (inner) tl.fromTo(inner, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, '<0.15');
      });
      $$('[data-clip]').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(10% 6% 10% 6% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });

      /* Hero recedes on scroll */
      if (heroBox) {
        const st = { trigger: heroBox, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(heroBox, { scale: 0.93, borderRadius: 44, ease: 'none', scrollTrigger: st });
        if (media) gsap.to(media, { yPercent: 14, ease: 'none', scrollTrigger: st });
        gsap.to('[data-hero-content]', { y: -90, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
      }

      /* Floating nav after the hero */
      const fnav = $('[data-float-nav]');
      if (fnav && heroBox) {
        gsap.set(fnav, { y: 0, yPercent: -200 });
        ScrollTrigger.create({
          trigger: heroBox,
          start: 'bottom 90',
          onEnter: () => gsap.to(fnav, { yPercent: 0, duration: 0.8, ease: 'expo.out' }),
          onLeaveBack: () => gsap.to(fnav, { yPercent: -200, duration: 0.5, ease: 'power3.in' })
        });
      }

      /* News highlights: horizontal scroll (desktop) */
      const hs = $('[data-hs]');
      const sticky = $('[data-hs-sticky]');
      const track = $('[data-hs-track]');
      const prog = $('[data-hs-progress]');
      if (desktop && hs && sticky && track) {
        gsap.set(track, { overflow: 'visible', scrollSnapType: 'none' });
        gsap.set(sticky, { position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 72, paddingBottom: 24 });
        const dist = () => Math.max(0, track.scrollWidth - sticky.clientWidth);
        const size = () => {
          gsap.set(sticky, { height: window.innerHeight });
          gsap.set(hs, { height: window.innerHeight + dist() });
        };
        size();
        ScrollTrigger.addEventListener('refreshInit', size);
        const st = { trigger: hs, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true };
        gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: st });
        if (prog) gsap.fromTo(prog, { scaleX: 0.08 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...st } });
        ctx.add(() => () => {
          ScrollTrigger.removeEventListener('refreshInit', size);
          gsap.set([hs, sticky, track], { clearProps: 'all' });
        });
      }

      /* Statement: words light up, image pills grow */
      $$('[data-split="words-scrub"]').forEach((el) => {
        const trig = { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true };
        const split = SplitText.create(el, { type: 'words' });
        gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: trig });
        gsap.from($$('[data-pill]', el), { width: 0, marginLeft: 0, marginRight: 0, ease: 'none', stagger: 0.3, scrollTrigger: trig });
      });

      /* Stacking programme cards */
      const cards = $$('[data-stack-card]');
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const dim = $('[data-dim]', card);
        const top = parseFloat(getComputedStyle(next).top) || 120;
        const st = { trigger: next, start: 'top bottom', end: `top ${top}px`, scrub: true };
        gsap.to(card, { scale: 0.9 + i * 0.02, ease: 'none', scrollTrigger: st });
        if (dim) gsap.to(dim, { opacity: 0.45, ease: 'none', scrollTrigger: st });
      });

      /* Parallax + compass spin */
      $$('[data-parallax]').forEach((el) => {
        gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el.closest('a') || el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      $$('[data-spin]').forEach((el) => {
        gsap.to(el, { rotate: 140, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      /* Magnetic buttons */
      if (hover) {
        $$('[data-magnetic]').forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
          const move = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.3);
            yTo((e.clientY - r.top - r.height / 2) * 0.4);
          };
          const leave = () => { xTo(0); yTo(0); };
          el.addEventListener('mousemove', move);
          el.addEventListener('mouseleave', leave);
          ctx.add(() => () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); });
        });
      }
    });
  };

  /* ------------------------------------------------------------------
     Boot — wait for fonts so SplitText measures the real lines
     ------------------------------------------------------------------ */
  const boot = () => {
    initNews();
    if (!window.gsap || !window.ScrollTrigger || !window.SplitText) return;
    gsap.registerPlugin(ScrollTrigger);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) initLenis();
    initMotion();
    ScrollTrigger.refresh();
  };

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
  else window.addEventListener('load', boot);
})();
