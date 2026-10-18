(() => {
  const profilePath = id => `${id}/`;
  const executors = window.EXECUTORS || [];
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const STATUS = {
    working: 'Working',
    updating: 'Updating',
    down: 'Down'
  };
  const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const logoClass = e => e.invertLogo ? ' is-inverted' : '';
  const hasLink = url => Boolean(url) && url !== '#';

  // Background
  Topography.mount($('.topography'), { variant: 'home', hover: '.btn, .card, .chip' });

  // Stats
  const stats = {
    total: executors.length,
    free: executors.filter(e => e.price === 'Free').length,
    keyless: executors.filter(e => !e.keySystem).length,
    working: executors.filter(e => e.status === 'working').length
  };
  $$('[data-stat]').forEach(el => {
    const key = el.dataset.stat;
    if (key in stats) countUp(el, stats[key]);
  });

  function countUp(el, target) {
    if (reducedMotion) { el.textContent = target; return; }
    const start = performance.now(), duration = 900;
    const tick = now => {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * (1 - (1 - p) ** 3));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const _now = new Date();
  $('[data-stat="updated"]').textContent = `${_now.toLocaleDateString('en-US', { month: 'short' })}. ${_now.getFullYear()}`;

  // Tags shown on cards and in the modal
  const tagsFor = e => [
    `<span class="tag tag--status is-${e.status}"><i></i>${STATUS[e.status] || e.status}</span>`,
    `<span class="tag">${escapeHTML(e.price)}</span>`,
    `<span class="tag">${e.keySystem ? 'Key system' : 'Keyless'}</span>`,
    ...e.platforms.map(p => `<span class="tag">${escapeHTML(p)}</span>`)
  ].join('');

  // Library grid
  const grid = $('#grid');
  const empty = $('#empty');
  let activeFilter = 'all';
  let query = '';

  const FILTERS = {
    all: () => true,
    free: e => e.price === 'Free',
    paid: e => e.price === 'Paid',
    keyless: e => !e.keySystem,
    working: e => e.status === 'working'
  };

  // Cards are links to #id, so a detail view can be shared or bookmarked.
  function renderGrid() {
    const q = query.trim().toLowerCase();
    const list = executors.filter(e =>
      FILTERS[activeFilter](e) &&
      (!q || `${e.name} ${e.tagline} ${e.features.join(' ')}`.toLowerCase().includes(q))
    );
    grid.innerHTML = list.map((e, i) => `
      <a class="card" href="${profilePath(e.id)}" data-id="${e.id}" style="--i:${i}">
        <span class="card__shot">
          <img src="${e.ui}" alt="${escapeHTML(e.name)} Executor interface preview" loading="lazy">
        </span>
        <span class="card__body">
          <span class="card__head">
            <img class="card__logo${logoClass(e)}" src="${e.logo}" alt="${escapeHTML(e.name)} Roblox Executor logo" width="44" height="44" loading="lazy">
            <span class="card__title">
              <strong>${escapeHTML(e.name)}</strong>
              <span>${escapeHTML(e.tagline)}</span>
            </span>
          </span>
          <span class="tags">${tagsFor(e)}</span>
          <span class="card__actions">
            <span class="card__download" data-details="${profilePath(e.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4.5 10 3.5v7H3zM11 3.35l10-1.4v8.55H11zM3 12.5h7v7L3 18.5zM11 12.5h10v8.55l-10-1.4z"/></svg>Download</span>
          </span>
        </span>
        <span class="card__more" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M5 11 11 5M6 5h5v5" /></svg>
        </span>
      </a>`).join('');
    empty.hidden = list.length > 0;
  }

  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => {
      c.classList.toggle('is-active', c === chip);
      c.setAttribute('aria-pressed', c === chip);
    });
    activeFilter = chip.dataset.filter;
    renderGrid();
  }));

  const search = $('#search');
  search.addEventListener('input', () => { query = search.value; renderGrid(); });
  search.addEventListener('keydown', event => {
    if (event.key === 'Escape' && search.value) { search.value = ''; query = ''; renderGrid(); }
  });
  addEventListener('keydown', event => {
    if (event.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName) && !modal.open) {
      event.preventDefault();
      search.focus();
    }
  });

  grid.addEventListener('click', event => {
    const card = event.target.closest('.card');
    if (!card || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    location.href = card.getAttribute('href');
  });

  // Detail modal
  const modal = $('#modal');
  let opener = null;

  // Placeholder links ('#') render as unavailable instead of opening a blank tab.
  function setLink(el, url) {
    if (hasLink(url)) {
      el.href = url;
      el.removeAttribute('aria-disabled');
      el.removeAttribute('tabindex');
    } else {
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
      el.setAttribute('tabindex', '-1');
    }
  }

  function openModal(id, from) {
    const e = executors.find(x => x.id === id);
    if (!e) return;
    opener = from || null;
    $('#modal-ui').src = e.ui;
    $('#modal-ui').alt = `${e.name} interface`;
    $('#modal-logo').src = e.logo;
    $('#modal-logo').className = `modal__logo${logoClass(e)}`;
    $('#modal-title').textContent = e.name;
    $('#modal-tagline').textContent = e.tagline;
    $('#modal-desc').textContent = e.description;
    $('#modal-tags').innerHTML = tagsFor(e);
    $('#modal-features').innerHTML = e.features.map(f => `<li>${escapeHTML(f)}</li>`).join('');
    setLink($('#modal-download'), e.download);
    setLink($('#modal-site'), e.website);
    $('#modal-note').hidden = hasLink(e.download);
    if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
    modal.classList.remove('is-closing');
    if (!modal.open) modal.showModal();
    modal.scrollTop = 0;
    document.documentElement.classList.add('is-locked');
  }

  function closeModal() {
    if (!modal.open || modal.classList.contains('is-closing')) return;
    modal.classList.add('is-closing');
    setTimeout(() => {
      modal.classList.remove('is-closing');
      modal.close();
    }, reducedMotion ? 0 : 180);
  }

  modal.addEventListener('close', () => {
    document.documentElement.classList.remove('is-locked');
    if (executors.some(e => `#${e.id}` === location.hash)) history.replaceState(null, '', location.pathname + location.search);
    opener?.focus({ preventScroll: true });
    opener = null;
  });
  modal.addEventListener('cancel', event => { event.preventDefault(); closeModal(); });
  $('.modal__close').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });

  const openFromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (executors.some(e => e.id === id)) openModal(id, grid.querySelector(`[data-id="${id}"]`));
  };
  addEventListener('hashchange', openFromHash);

  // Showcase carousel
  const stage = $('#showcase-stage');
  const tabs = $('#showcase-tabs');
  const label = $('#showcase-label');
  let current = 0, timer = null;

  stage.innerHTML = executors.map((e, i) =>
    `<img src="${e.ui}" alt="${escapeHTML(e.name)} Executor interface preview" class="${i === 0 ? 'is-active' : ''}" ${i ? 'loading="lazy"' : ''}>`
  ).join('');
  tabs.innerHTML = executors.map((e, i) =>
    `<button type="button" role="tab" aria-selected="${i === 0}" data-index="${i}">
      <img class="${logoClass(e).trim()}" src="${e.logo}" alt="${escapeHTML(e.name)} Roblox Executor logo" width="22" height="22">${escapeHTML(e.name)}
    </button>`
  ).join('');

  function show(index) {
    current = (index + executors.length) % executors.length;
    $$('#showcase-stage img').forEach((img, i) => img.classList.toggle('is-active', i === current));
    $$('#showcase-tabs button').forEach((tab, i) => {
      tab.setAttribute('aria-selected', i === current);
      tab.tabIndex = i === current ? 0 : -1;
    });
    label.textContent = executors[current]?.name || '';
  }

  function stopAutoplay() { clearInterval(timer); timer = null; }
  function autoplay() {
    stopAutoplay();
    if (reducedMotion || document.hidden || modal.open) return;
    timer = setInterval(() => show(current + 1), 4200);
  }

  // Pause while the visitor is looking at a preview, the modal is open or the tab is hidden.
  const frame = $('.showcase__frame');
  frame.addEventListener('pointerenter', stopAutoplay);
  frame.addEventListener('pointerleave', autoplay);
  document.addEventListener('visibilitychange', autoplay);
  modal.addEventListener('close', autoplay);
  new MutationObserver(() => { if (modal.open) stopAutoplay(); }).observe(modal, { attributes: true, attributeFilter: ['open'] });

  tabs.addEventListener('click', event => {
    const tab = event.target.closest('button');
    if (!tab) return;
    show(Number(tab.dataset.index));
    autoplay();
  });
  tabs.addEventListener('keydown', event => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    show(current + step);
    tabs.children[current].focus();
    autoplay();
  });
  if (executors.length) { show(0); autoplay(); }

  // FAQ: only one item open at a time
  $$('.faq__item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) $$('.faq__item').forEach(other => { if (other !== item) other.open = false; });
    });
    const summary = item.querySelector('summary');
    summary.addEventListener('click', event => {
      event.preventDefault();
      if (item.open) {
        item.classList.add('is-closing');
        setTimeout(() => { item.open = false; item.classList.remove('is-closing'); }, 220);
      } else {
        item.open = true;
        item.classList.add('is-opening');
        setTimeout(() => item.classList.remove('is-opening'), 280);
      }
    });
  });

  // Nav: shadow on scroll + mobile menu
  const nav = $('#nav');
  const toggle = $('.nav__toggle');
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false); });
  matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  $('#year').textContent = new Date().getFullYear();
  renderGrid();
  openFromHash();
})();
