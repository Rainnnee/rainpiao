(() => {
  // Employment is separate from projects and stays absent until real entries exist.
  const employment = document.querySelector('#employment');
  const employmentList = document.querySelector('[data-employment-list]');
  const employmentTemplate = document.querySelector('#employment-entry-template');
  try {
    const entries = JSON.parse(document.querySelector('#employment-data')?.textContent || '[]');
    if (employment && employmentList && employmentTemplate && Array.isArray(entries)) {
      const valid = entries.filter(entry => entry && typeof entry.role === 'string' && entry.role.trim() && typeof entry.organization === 'string' && entry.organization.trim() && typeof entry.period === 'string');
      valid.sort((a, b) => String(b.startDate || '').localeCompare(String(a.startDate || '')));
      for (const entry of valid) {
        const fragment = employmentTemplate.content.cloneNode(true);
        fragment.querySelector('[data-employment-role]').textContent = entry.role;
        fragment.querySelector('[data-employment-organization]').textContent = entry.organization;
        const date = fragment.querySelector('[data-employment-date]');
        date.textContent = entry.period;
        if (/^\d{4}-\d{2}(-\d{2})?$/.test(entry.startDate || '')) date.dateTime = entry.startDate;
        const highlights = fragment.querySelector('[data-employment-highlights]');
        for (const line of Array.isArray(entry.highlights) ? entry.highlights : []) {
          if (typeof line !== 'string') continue;
          const item = document.createElement('li');
          item.textContent = line;
          highlights.append(item);
        }
        if (!highlights.childElementCount) highlights.remove();
        if (entry.url) {
          try {
            const url = new URL(entry.url);
            if (['https:', 'http:'].includes(url.protocol)) {
              const link = fragment.querySelector('[data-employment-link]');
              link.href = url.href;
              link.hidden = false;
            }
          } catch { /* An invalid optional link does not hide the role. */ }
        }
        employmentList.append(fragment);
      }
      if (employmentList.childElementCount) {
        employment.hidden = false;
        document.querySelector('[data-employment-nav]').hidden = false;
      }
    }
  } catch { /* Project content is independent of the optional employment data. */ }

  const work = document.querySelector('#experience');
  const groups = [...(work?.querySelectorAll('.work-group') || [])];
  if (!groups.length) return;
  const shelves = groups.map(group => {
    const track = group.querySelector('.work-group__cards');
    const cards = [...track.querySelectorAll('[data-project-id]')];
    const title = group.querySelector('h3').textContent;
    const names = { zisheng: '字生 · Zisheng', poker: 'PocketSolver', pusheng: 'Pusheng', lidar: 'LiDAR traffic', rollouts: 'Rollouts to Rank', bruinml: 'CLIP detection' };
    let thumbnails = null;
    let buttons = [];
    if (['machine-learning', 'research', 'software'].includes(group.id)) {
      thumbnails = document.createElement('nav');
      thumbnails.className = 'work-shelf__thumbnails';
      thumbnails.setAttribute('aria-label', `${title} overview`);
      thumbnails.hidden = true;
      buttons = cards.map((card, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        const name = names[card.dataset.projectId] || card.dataset.projectLabel;
        button.setAttribute('aria-label', `Show ${name}`);
        const image = card.querySelector('.concept-cover__drawing')?.cloneNode(true);
        if (image) { image.alt = ''; image.removeAttribute('class'); button.append(image); }
        const caption = document.createElement('span'); caption.textContent = name;
        button.append(caption);
        button.addEventListener('click', () => {
          track.scrollTo({ left: offset(index), behavior: 'smooth' });
          // A thumbnail below the fold should bring its chosen project back into view.
          if (track.getBoundingClientRect().top < (document.querySelector('.site-nav')?.getBoundingClientRect().bottom || 0) + 16) {
            group.scrollIntoView({ block: 'start', behavior: 'smooth' });
          }
        });
        thumbnails.append(button);
        return button;
      });
      track.after(thumbnails);
    }
    const controls = document.createElement('div');
    controls.className = 'work-shelf__controls'; controls.hidden = true;
    const previous = document.createElement('button');
    previous.type = 'button'; previous.textContent = '←'; previous.setAttribute('aria-label', `Previous entry in ${title}`);
    const next = document.createElement('button');
    next.type = 'button'; next.textContent = '→'; next.setAttribute('aria-label', `Next entry in ${title}`);
    controls.append(previous, next); group.querySelector('.work-group__heading').append(controls);
    let savedLeft = 0;
    let frame = 0;
    function offset(index) {
      return cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    }
    function update() {
      frame = 0;
      if (document.body.dataset.mode !== 'animated') return;
      controls.hidden = track.scrollWidth <= track.clientWidth + 3;
      previous.disabled = next.disabled = cards.length < 2;
      const active = cards.reduce((best, card, index) => Math.abs(offset(index) - track.scrollLeft) < Math.abs(offset(best) - track.scrollLeft) ? index : best, 0);
      buttons.forEach((button, index) => {
        if (index === active) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
      savedLeft = track.scrollLeft;
    }
    function queue() { if (!frame) frame = requestAnimationFrame(update); }
    function move(direction) {
      // Wrap only after a visitor asks to move beyond an end; never auto-advance.
      const step = cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
      const end = track.scrollWidth - track.clientWidth;
      const target = direction > 0 && track.scrollLeft >= end - 3 ? 0 :
        direction < 0 && track.scrollLeft <= 3 ? end : track.scrollLeft + direction * step;
      track.scrollTo({ left: target, behavior: 'smooth' });
    }
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', queue, { passive: true });
    track.addEventListener('keydown', event => {
      if (document.body.dataset.mode !== 'animated' || event.target !== track) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault(); track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: 'smooth' });
      }
    });
    if (typeof ResizeObserver === 'function') new ResizeObserver(queue).observe(track);
    return { group, track, cards, update, reveal(card) { track.scrollTo({left:offset(cards.indexOf(card)),behavior:'instant'}); }, mode(enabled) {
      if (thumbnails) thumbnails.hidden = !enabled;
      if (enabled) {
        track.tabIndex = 0; track.setAttribute('role', 'region'); track.setAttribute('aria-label', `${title} gallery`);
        requestAnimationFrame(() => { track.scrollLeft = savedLeft; update(); });
      } else {
        controls.hidden = true;
        for (const attribute of ['tabindex','role','aria-label']) track.removeAttribute(attribute);
      }
    } };
  });
  function spacing() {
    const enabled = document.body.dataset.mode === 'animated';
    const offset = enabled ? (document.querySelector('.site-nav')?.getBoundingClientRect().height || 64) + 32 : 0;
    document.documentElement.style.setProperty('--anchor-top', `${offset}px`);
    [work, ...groups].forEach(element => { element.style.scrollMarginTop = enabled ? '0px' : ''; });
  }
  function mode() {
    const enabled = document.body.dataset.mode === 'animated';
    document.body.dataset.workShelves = String(enabled);
    shelves.forEach(shelf => shelf.mode(enabled)); spacing();
  }
  function revealProject() {
    if (document.body.dataset.mode !== 'animated') return;
    const slug = new URL(location.href).searchParams.get('project');
    if (!slug) return;
    for (const shelf of shelves) {
      const card = shelf.cards.find(card => [...card.querySelectorAll('a[href]')].some(link => new URL(link.href).pathname.endsWith(`/projects/${slug}.html`)));
      if (card) requestAnimationFrame(() => shelf.reveal(card));
    }
  }
  document.addEventListener('rainpiao:modechange', mode);
  if (typeof ResizeObserver === 'function') {
    const mainNav = document.querySelector('.site-nav');
    if (mainNav) new ResizeObserver(spacing).observe(mainNav);
  }
  mode(); revealProject();
})();
