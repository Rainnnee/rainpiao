import { mountProjectDemos, disposeProjectDemos } from './project-embeds.js';

(() => {
  const body = document.body;
  const root = document.documentElement;
  const toggle = document.querySelector(".mode-toggle");

  function currentMode() {
    try {
      return localStorage.getItem("rainpiao-mode") === "accessible" ? "accessible" : "animated";
    } catch {
      return "animated";
    }
  }

  function setMode(mode, persist = false) {
    const accessible = mode === "accessible";
    root.dataset.mode = accessible ? "accessible" : "animated";
    body.dataset.mode = root.dataset.mode;
    toggle.setAttribute("aria-checked", String(accessible));
    toggle.setAttribute("aria-label", `Switch to ${accessible ? "Immersive" : "Reading"} mode`);
    if (persist) {
      try {
        localStorage.setItem("rainpiao-mode", root.dataset.mode);
      } catch {
        // Keep the mode toggle usable when browser storage is unavailable.
      }
    }
  }

  setMode(currentMode());
  mountProjectDemos();
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    setMode(body.dataset.mode === "accessible" ? "animated" : "accessible", true);
    disposeProjectDemos(document);
    mountProjectDemos();
  });

  // A project return is navigation, not a fresh visit that should replay the intro.
  for (const link of document.querySelectorAll('.project-detail-nav__back, .project-detail__back-bottom')) {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      try { sessionStorage.setItem('rainpiao-project-return', String(Date.now())); }
      catch { /* Normal links still work when storage is unavailable. */ }
    });
  }
})();
