const demoURL = new URL('../../demos/zisheng/', import.meta.url);
const frames = new Map();

function attach(host) {
  if (frames.has(host)) return;
  const iframe = document.createElement('iframe');
  iframe.title = 'Try Zisheng: interactive Chinese character diffusion';
  iframe.src = demoURL.href;
  iframe.className = 'project-demo-frame';
  iframe.loading = 'lazy';
  host.querySelector('[data-demo-mount]').append(iframe);
  frames.set(host, iframe);
}

function detach(host) {
  const iframe = frames.get(host);
  if (!iframe) return;
  iframe.contentWindow?.postMessage({ type: 'zisheng:pause' }, location.origin);
  iframe.remove();
  frames.delete(host);
}

export function mountProjectDemos(root = document) {
  for (const host of root.querySelectorAll('[data-project-demo="zisheng"]')) {
    if (!host.dataset.demoBound) {
      host.dataset.demoBound = 'true';
      host.addEventListener('toggle', () => { if (host.open) attach(host); else detach(host); });
    }
    host.open = document.body.dataset.mode !== 'accessible';
    if (host.open) attach(host);
  }
}

export function disposeProjectDemos(root) {
  for (const host of root.querySelectorAll('[data-project-demo="zisheng"]')) detach(host);
}

window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.data?.type !== 'zisheng:height') return;
  for (const iframe of frames.values()) {
    if (event.source !== iframe.contentWindow) continue;
    const height = Number(event.data.height);
    if (Number.isFinite(height)) iframe.style.height = `${Math.max(400, Math.min(1800, height))}px`;
  }
});
