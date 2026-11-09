import { mountProjectDemos, disposeProjectDemos } from './project-embeds.js';

(() => {
  const dialog = document.querySelector('#project-reader');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const content = dialog.querySelector('[data-reader-content]');
  const viewport = dialog.querySelector('.project-reader__viewport');
  const pageLink = dialog.querySelector('[data-reader-page]');
  const closeButton = dialog.querySelector('[data-reader-close]');
  const homeTitle = document.title;
  const owner = `${Date.now()}-${Math.random()}`;
  const projects = new Map();
  const cache = new Map();
  let origin = null;
  let request = 0;
  let closingTimer;
  let closingListener;
  let activeSlug;
  let dismissing = false;
  let pointerStartedOutside = false;

  for (const link of document.querySelectorAll('.work-directory a[href], .toolkit-evidence[href]')) {
    const url = new URL(link.href);
    if (url.origin !== location.origin || !/\/projects\/[^/]+\.html$/.test(url.pathname)) continue;
    const slug = url.pathname.split('/').pop().replace(/\.html$/, '');
    const card = link.closest('[data-project-id]');
    projects.set(slug, { slug, url: url.href, label: card?.dataset.projectLabel || projects.get(slug)?.label || 'Project', trigger: card ? link : projects.get(slug)?.trigger || link });
    link.dataset.readerProject = slug;
  }

  function selectedProject() {
    return projects.get(new URL(location.href).searchParams.get('project'));
  }

  function load(project) {
    if (!cache.has(project.slug)) {
      const pending = fetch(project.url, { credentials: 'same-origin' }).then(response => {
        if (!response.ok) throw new Error('Project unavailable');
        return response.text();
      }).then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        if (!doc.querySelector('.project-detail > article h1')) throw new Error('Missing project article');
        return doc;
      }).catch(error => {
        cache.delete(project.slug);
        throw error;
      });
      cache.set(project.slug, pending);
    }
    return cache.get(project.slug);
  }

  function showStatus(title, message) {
    const heading = document.createElement('h1');
    heading.id = 'project-reader-title';
    heading.tabIndex = -1;
    heading.textContent = title;
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.textContent = message;
    content.replaceChildren(heading, status);
    heading.focus({ preventScroll: true });
  }

  function articleFor(doc, url) {
    // Reuse the standalone article; no second copy of the project prose to maintain.
    const article = document.importNode(doc.querySelector('.project-detail > article'), true);
    for (const element of article.querySelectorAll('script, iframe, object, embed')) element.remove();
    for (const element of article.querySelectorAll('*')) {
      for (const attribute of [...element.attributes]) {
        if (attribute.name.startsWith('on')) element.removeAttribute(attribute.name);
      }
      for (const attribute of ['src', 'href']) {
        const value = element.getAttribute(attribute);
        if (!value || value.startsWith('#')) continue;
        const absolute = new URL(value, url);
        if (['http:', 'https:'].includes(absolute.protocol)) element.setAttribute(attribute, absolute.href);
        else element.removeAttribute(attribute);
      }
    }
    const ids = new Map();
    for (const element of article.querySelectorAll('[id]')) {
      ids.set(element.id, `reader-${element.id}`);
      element.id = ids.get(element.id);
    }
    for (const element of article.querySelectorAll('[aria-labelledby], [aria-describedby], a[href^="#"]')) {
      for (const attribute of ['aria-labelledby', 'aria-describedby']) {
        if (element.hasAttribute(attribute)) element.setAttribute(attribute, element.getAttribute(attribute).split(/\s+/).map(id => ids.get(id) || id).join(' '));
      }
      if (element.matches('a[href^="#"]')) {
        const id = element.getAttribute('href').slice(1);
        if (ids.has(id)) element.setAttribute('href', `#${ids.get(id)}`);
      }
    }
    const heading = article.querySelector('h1');
    heading.id = 'project-reader-title';
    heading.tabIndex = -1;
    return article;
  }

  function clearClosing() {
    clearTimeout(closingTimer);
    if (closingListener) dialog.removeEventListener('animationend', closingListener);
    closingListener = null;
  }

  function captureMotion(phase) {
    const style = getComputedStyle(dialog);
    dialog.style.setProperty(`--reader-${phase}-transform`, style.transform === 'none' ? 'translateY(0)' : style.transform);
    dialog.style.setProperty(`--reader-${phase}-opacity`, style.opacity);
    dialog.style.setProperty(`--reader-${phase}-filter`, style.filter);
    dialog.style.setProperty(`--reader-backdrop-${phase}`, getComputedStyle(dialog, '::backdrop').opacity);
  }

  async function open(project, trigger, push = true) {
    dismissing = false;
    clearClosing();
    if (dialog.open && dialog.classList.contains('is-closing')) captureMotion('enter');
    else for (const property of ['transform', 'opacity', 'filter']) dialog.style.removeProperty(`--reader-enter-${property}`);
    if (!dialog.open) dialog.style.removeProperty('--reader-backdrop-enter');
    dialog.classList.remove('is-closing');
    if (!dialog.open) {
      origin = { y: window.scrollY, focus: trigger || document.activeElement, restoration: history.scrollRestoration };
      history.scrollRestoration = 'manual';
      document.documentElement.classList.add('project-reader-open');
      dialog.showModal();
    }
    activeSlug = project.slug;
    const token = ++request;
    pageLink.href = project.url;
    pageLink.setAttribute('aria-label', `Open ${project.label} as a full page`);
    if (push) {
      const url = new URL(location.href);
      url.searchParams.set('project', project.slug);
      history.pushState({ ...history.state, portfolioProject: project.slug, portfolioPanelOwner: owner }, '', url);
    }
    document.title = `${project.label} — Rain Piao`;
    viewport.scrollTop = 0;
    dialog.dataset.content = 'loading';
    content.setAttribute('aria-busy', 'true');
    showStatus(project.label, 'Loading project…');
    try {
      const doc = await load(project);
      if (token !== request || !dialog.open || dialog.classList.contains('is-closing')) return;
      content.replaceChildren(articleFor(doc, project.url));
      mountProjectDemos(content);
      dialog.dataset.content = 'ready';
      content.removeAttribute('aria-busy');
      viewport.scrollTop = 0;
      // Do not steal focus if the visitor has already moved to a toolbar control.
      if (document.activeElement === dialog || content.contains(document.activeElement) || document.activeElement === document.body) {
        content.querySelector('h1').focus({ preventScroll: true });
      }
    } catch {
      if (token !== request || !dialog.open) return;
      content.removeAttribute('aria-busy');
      showStatus(project.label, 'The project could not be loaded here. Use “Open full page” above, or close this panel and try again.');
    }
  }

  function hide() {
    if (!dialog.open) return;
    dismissing = true;
    ++request;
    activeSlug = null;
    captureMotion('exit');
    dialog.classList.add('is-closing');
    const reduced = document.body.dataset.mode === 'accessible' ||
      (document.documentElement.dataset.mode !== 'animated' && matchMedia('(prefers-reduced-motion: reduce)').matches);
    const finish = () => {
      clearClosing();
      dialog.close();
      disposeProjectDemos(content);
      content.replaceChildren();
      dialog.classList.remove('is-closing');
      document.title = homeTitle;
      // Lock out smooth scrolling until both the position and focus are restored.
      if (origin) {
        window.scrollTo({ top: origin.y, behavior: 'instant' });
        origin.focus?.focus({ preventScroll: true });
        history.scrollRestoration = origin.restoration;
      }
      document.documentElement.classList.remove('project-reader-open');
      origin = null;
      dismissing = false;
    };
    if (reduced) finish();
    else {
      closingListener = event => {
        if (event.target === dialog && event.animationName === 'reader-leave') finish();
      };
      dialog.addEventListener('animationend', closingListener);
      const duration = parseFloat(getComputedStyle(dialog).getPropertyValue('--reader-close-duration')) || 260;
      closingTimer = setTimeout(finish, duration + 80);
    }
  }

  function dismiss() {
    if (dismissing || dialog.classList.contains('is-closing')) return;
    dismissing = true;
    if (history.state?.portfolioPanelOwner === owner) history.back();
    else {
      const url = new URL(location.href);
      url.searchParams.delete('project');
      history.replaceState(history.state, '', url);
      hide();
    }
  }

  closeButton.addEventListener('click', dismiss);
  dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
  function outside(event) {
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  }
  dialog.addEventListener('pointerdown', event => { pointerStartedOutside = outside(event); });
  dialog.addEventListener('click', event => {
    if (event.target === dialog && pointerStartedOutside && outside(event)) dismiss();
    pointerStartedOutside = false;
  });
  content.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target && content.contains(target)) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-reader-project]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
    const project = projects.get(link.dataset.readerProject);
    if (!project) return;
    event.preventDefault();
    open(project, link);
  });
  function warm(event) {
    const link = event.target.closest('a[data-reader-project]');
    if (link && !navigator.connection?.saveData) load(projects.get(link.dataset.readerProject)).catch(() => {});
  }
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);
  window.addEventListener('popstate', () => {
    const project = selectedProject();
    if (project) {
      if (!dialog.open || activeSlug !== project.slug || dialog.classList.contains('is-closing')) open(project, null, false);
    } else hide();
  });
  const initial = selectedProject();
  if (initial) requestAnimationFrame(() => {
    initial.trigger.scrollIntoView({ block: 'center', behavior: 'instant' });
    open(initial, initial.trigger, false);
  });
})();
