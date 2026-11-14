/* PFST — novosti (referenca). Filtriranje, poredak i prikaz na klijentu; u Next.js isto stanje ide u URL (?kategorija=…&razdoblje=…&q=…&poredak=…). */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const feed = $('[data-feed]');
  if (!feed) return;

  const cards = $$('.nc', feed);
  const form = $('[data-filters]');
  const qInput = $('input[name="q"]', form);
  const NOW = new Date('2026-11-13'); // reference "today" for the demo data
  const PERIODS = { sve: 'Sve', tjedan: 'Ovaj tjedan', mjesec: 'Ovaj mjesec', 2026: '2026.', 2025: '2025.' };
  const state = { cats: [], period: 'sve', q: '', sort: 'new', view: 'grid' };

  const inPeriod = (iso) => {
    const days = (NOW - new Date(iso)) / 86400000;
    if (state.period === 'tjedan') return days <= 7;
    if (state.period === 'mjesec') return days <= 31;
    if (state.period === '2026' || state.period === '2025') return iso.startsWith(state.period);
    return true;
  };
  const plural = (n) => (n === 1 ? '1 objava' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? `${n} objave` : `${n} objava`));

  const render = () => {
    const q = state.q.trim().toLowerCase();
    const base = cards.filter((c) => inPeriod(c.dataset.date) && (!q || $('.nt', c).textContent.toLowerCase().includes(q)));
    const visible = base.filter((c) => !state.cats.length || state.cats.includes(c.dataset.cat));

    // counts reflect search + period (so a category's count = what you'd get by ticking it)
    $$('[data-count]').forEach((el) => { el.textContent = base.filter((c) => c.dataset.cat === el.dataset.count).length; });

    // sort + show/hide
    const sorted = cards.slice().sort((a, b) => {
      const d = a.dataset.date.localeCompare(b.dataset.date) || (b.dataset.idx - a.dataset.idx);
      return state.sort === 'new' ? -d : d;
    });
    sorted.forEach((c) => { feed.appendChild(c); c.hidden = !visible.includes(c); });

    const pristine = !state.cats.length && !q && state.period === 'sve' && state.sort === 'new';
    feed.classList.toggle('has-feat', pristine && state.view === 'grid');
    feed.classList.toggle('is-grid', state.view === 'grid');
    feed.classList.toggle('is-list', state.view === 'list');
    feed.hidden = visible.length === 0;
    $('[data-empty]').hidden = visible.length !== 0;
    $('[data-count-label]').textContent = plural(visible.length);

    // active filter chips
    const wrap = $('[data-chips-wrap]');
    $$('.achip', wrap).forEach((el) => el.remove());
    const chips = [
      ...state.cats.map((c) => [c, () => { state.cats = state.cats.filter((x) => x !== c); $(`input[value="${c}"]`, form).checked = false; }]),
      ...(state.period !== 'sve' ? [[PERIODS[state.period], () => setPeriod('sve')]] : []),
      ...(q ? [[`„${state.q.trim()}”`, () => { state.q = ''; qInput.value = ''; }]] : []),
    ];
    chips.forEach(([label, remove]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'achip'; b.setAttribute('aria-label', `Ukloni filtar ${label}`);
      b.innerHTML = `${label}<span><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></span>`;
      b.addEventListener('click', () => { remove(); render(); });
      wrap.appendChild(b);
    });
    $('[data-active-count]').textContent = `${chips.length} aktivno`;
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };

  const setPeriod = (k) => {
    state.period = k;
    $$('[data-period]').forEach((b) => { const on = b.dataset.period === k; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
  };

  form.addEventListener('submit', (e) => e.preventDefault());
  qInput.addEventListener('input', () => { state.q = qInput.value; render(); });
  $$('input[name="cat"]', form).forEach((cb) => cb.addEventListener('change', () => {
    state.cats = $$('input[name="cat"]:checked', form).map((x) => x.value); render();
  }));
  $$('[data-period]').forEach((b) => b.addEventListener('click', () => { setPeriod(b.dataset.period); render(); }));
  $$('[data-clear]').forEach((b) => b.addEventListener('click', () => {
    state.cats = []; state.q = ''; qInput.value = ''; $$('input[name="cat"]', form).forEach((x) => { x.checked = false; }); setPeriod('sve'); render();
  }));
  $$('[data-sort]').forEach((b) => b.addEventListener('click', () => {
    state.sort = b.dataset.sort;
    $$('[data-sort]').forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    render();
  }));
  $$('[data-view]').forEach((b) => b.addEventListener('click', () => {
    state.view = b.dataset.view;
    $$('[data-view]').forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    render();
  }));

  render();
})();
