/* PFST — navigacija (referenca)
   Desktop mega izbornik + mobilni izbornik. GSAP je opcionalan; sve radi i bez njega. */

(() => {
  const g = window.gsap;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------------- Desktop mega menu ---------------- */
  const trigger = document.querySelector('[data-mm-trigger]');
  const panel = trigger && document.getElementById(trigger.getAttribute('aria-controls'));
  const backdrop = document.querySelector('[data-mm-backdrop]');

  if (trigger && panel) {
    const setOpen = (open, { focus = true } = {}) => {
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      trigger.classList.toggle('is-on', open);
      panel.hidden = !open;
      if (backdrop) backdrop.hidden = !open;

      if (open) {
        if (g && !reduce) {
          g.fromTo(panel, { clipPath: 'inset(0% 0% 100% 0% round 24px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 0.8, ease: 'expo.out', clearProps: 'clipPath' });
          g.from(panel.querySelectorAll('[data-mm-item]'),
            { y: 18, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.035, delay: 0.12, clearProps: 'transform,opacity' });
        }
        if (focus) panel.focus({ preventScroll: true });   // focus moves into the panel
      } else if (focus) {
        trigger.focus({ preventScroll: true });            // and back to the trigger on close
      }
    };

    trigger.addEventListener('click', () => setOpen(trigger.getAttribute('aria-expanded') !== 'true'));
    if (backdrop) backdrop.addEventListener('click', () => setOpen(false));
    $$('[data-mm-close]').forEach((b) => b.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') setOpen(false);
    });

    // Reference page opens with the menu visible — play the intro once.
    setOpen(true, { focus: false });
  }

  /* ---------------- Mobile menu (accordion) ---------------- */
  $$('[data-acc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.getAttribute('aria-controls'));
      if (!target) return;
      const open = btn.getAttribute('aria-expanded') !== 'true';

      // one open item per level
      const level = btn.classList.contains('m1') ? '.m1' : '.m2';
      const scope = btn.closest('nav, [id^="m-"]');
      $$(level + '[aria-expanded="true"]', scope).forEach((other) => {
        if (other === btn) return;
        other.setAttribute('aria-expanded', 'false');
        other.classList.remove('is-open');
        const c = other.querySelector('.mchev'); if (c) c.classList.remove('is-open');
        const p = document.getElementById(other.getAttribute('aria-controls')); if (p) p.hidden = true;
      });

      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (btn.classList.contains('m2')) btn.classList.toggle('is-open', open);
      const chev = btn.querySelector('.mchev'); if (chev) chev.classList.toggle('is-open', open);
      target.hidden = !open;
      if (open && g && !reduce) g.from(target.children, { y: 10, opacity: 0, duration: 0.5, ease: 'expo.out', stagger: 0.03, clearProps: 'transform,opacity' });
    });
  });

  // Focus trap inside the mobile sheet
  const sheet = document.getElementById('mobile-menu');
  if (sheet) {
    sheet.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('a[href], button:not([disabled]), input', sheet).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();
