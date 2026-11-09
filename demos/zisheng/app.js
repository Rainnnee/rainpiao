const $ = id => document.getElementById(id);
try { document.body.dataset.mode = localStorage.getItem('rainpiao-mode') || 'animated'; } catch {}
const canvas = $('sample'), context = canvas.getContext('2d');
let worker, frames = [], replayTimer, running = false, recorded = false, following = true;
let processor = '';
const labels = [...$('character').options].map(option => option.textContent);

function paint(pixels) {
  $('empty-state').hidden = true;
  const image = context.createImageData(48, 48);
  for (let i = 0; i < pixels.length; i++) {
    image.data.set([pixels[i], pixels[i], pixels[i], 255], i * 4);
  }
  context.putImageData(image, 0, 0);
}
context.fillStyle = '#ffffff'; context.fillRect(0, 0, 48, 48);

function checkpoints() {
  $('checkpoints').replaceChildren();
  if (!frames.length) return;
  for (const target of [1000, 750, 500, 250, 0]) {
    if (frames.at(-1).remaining > target) continue;
    let index = 0;
    frames.forEach((frame, i) => { if (Math.abs(frame.remaining - target) < Math.abs(frames[index].remaining - target)) index = i; });
    const button = document.createElement('button');
    button.type = 'button'; button.setAttribute('aria-label', `Inspect actual state at timestep ${frames[index].remaining}`);
    const thumbnail = document.createElement('canvas'); thumbnail.width = 48; thumbnail.height = 48; thumbnail.setAttribute('aria-hidden', 'true');
    const ctx = thumbnail.getContext('2d'), data = ctx.createImageData(48, 48);
    frames[index].pixels.forEach((value, i) => data.data.set([value, value, value, 255], i * 4));
    ctx.putImageData(data, 0, 0);
    const caption = document.createElement('span'); caption.textContent = `t = ${frames[index].remaining}`;
    button.append(thumbnail, caption);
    button.addEventListener('click', () => { stopReplay(); following = false; $('follow').hidden = !running; show(index); });
    $('checkpoints').append(button);
  }
}

function stopReplay() { clearInterval(replayTimer); replayTimer = null; $('replay').textContent = 'Replay'; }
function show(index) {
  const frame = frames[index];
  if (!frame) return;
  paint(frame.pixels);
  $('timeline').value = index;
  $('step-label').textContent = `t = ${frame.remaining} · ${index} / ${frames.length - 1}`;
  canvas.setAttribute('aria-label', `${$('glyph-label').textContent}, noise timestep ${frame.remaining}${recorded ? ', recorded example' : ''}`);
}
function busy(value) {
  running = value;
  $('generate').disabled = value; $('stop').hidden = !value;
  for (const id of ['character', 'seed', 'steps', 'shuffle', 'recorded', 'lock-seed']) $(id).disabled = value;
  if (!value) $('follow').hidden = true;
}
function stop() {
  if (worker) { worker.terminate(); worker = null; }
  busy(false); stopReplay(); $('replay').disabled = frames.length < 2; checkpoints();
  if (frames.length) $('status').textContent = 'Stopped. You can still inspect the frames generated so far.';
}
function acceptFrame(frame) {
  frames.push(frame);
  $('timeline').disabled = false; $('timeline').max = frames.length - 1;
  $('replay').disabled = running || frames.length < 2;
  if (following) show(frames.length - 1);
  if (frame.remaining % 250 === 0) checkpoints();
}
$('controls').addEventListener('submit', event => {
  event.preventDefault();
  if (running || !$('controls').reportValidity()) return;
  stopReplay(); frames = []; recorded = false; following = true;
  if (!$('lock-seed').checked) $('seed').value = crypto.getRandomValues(new Uint32Array(1))[0];
  $('status').title = ''; $('checkpoints').replaceChildren();
  $('timeline').disabled = true; $('replay').disabled = true;
  $('glyph-label').textContent = labels[Number($('character').value)];
  busy(true); $('status').textContent = 'Starting the model…';
  if (!worker) {
    worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({data}) => {
      if (data.type === 'status') $('status').textContent = data.message;
      if (data.type === 'backend') processor = data.backend;
      if (data.type === 'frame') {
        acceptFrame(data);
        if (data.completed % 100 === 0 || data.total !== 1000) $('status').textContent = `Generating · ${processor} · ${data.completed} / ${data.total} model evaluations`;
      }
      if (data.type === 'complete') {
        busy(false); $('generate').textContent = 'Generate again'; $('replay').disabled = frames.length < 2; checkpoints();
        $('status').textContent = `New sample · seed ${$('seed').value} · ${data.sampler} · ${data.backend} · ${data.seconds.toFixed(1)} seconds sampling`;
        canvas.dataset.result = `${$('character').value}:${$('seed').value}:${$('steps').value}`;
      }
      if (data.type === 'error') { stop(); $('status').textContent = data.message; $('status').title = data.detail || ''; }
    };
    worker.onerror = () => { stop(); $('status').textContent = 'The model could not start. You can explore the recorded example or try another browser.'; };
  }
  worker.postMessage({ character: Number($('character').value), seed: Number($('seed').value), steps: Number($('steps').value), cpu: new URLSearchParams(location.search).get('cpu') === '1' });
});
$('shuffle').addEventListener('click', () => { $('seed').value = crypto.getRandomValues(new Uint32Array(1))[0]; });
$('stop').addEventListener('click', stop);
$('timeline').addEventListener('input', () => { stopReplay(); following = false; $('follow').hidden = !running; show(Number($('timeline').value)); });
$('follow').addEventListener('click', () => { following = true; $('follow').hidden = true; show(frames.length - 1); });
$('replay').addEventListener('click', () => {
  if (replayTimer) { stopReplay(); return; }
  let index = 0; $('replay').textContent = 'Pause';
  replayTimer = setInterval(() => { show(index++); if (index >= frames.length) stopReplay(); }, 80);
});
$('recorded').addEventListener('click', async () => {
  stopReplay(); $('status').textContent = 'Loading the recorded path…';
  try {
    const response = await fetch('./recorded.json');
    if (!response.ok) throw new Error();
    const data = await response.json();
    recorded = true; following = true; frames = data.frames.map(frame => ({...frame, pixels: Uint8Array.from(frame.pixels)}));
    const characterIndex = labels.findIndex(label => label.startsWith(data.character + ' '));
    if (characterIndex >= 0) $('character').value = characterIndex;
    $('seed').value = data.seed;
    $('steps').value = '1000';
    $('glyph-label').textContent = `${data.character} · recorded example`;
    $('timeline').disabled = false; $('timeline').max = frames.length - 1; $('replay').disabled = false;
    show(frames.length - 1);
    canvas.dataset.result = `recorded:${characterIndex}:${data.seed}:1000`;
    checkpoints();
    $('status').textContent = `Recorded model run · ${data.sampler} · seed ${data.seed}. Scrub or replay the actual saved states.`;
  } catch { $('status').textContent = 'The recorded example could not be loaded. Please try again.'; }
});
window.addEventListener('pagehide', stop);
window.addEventListener('message', event => {
  if (event.origin === location.origin && event.source === parent && event.data?.type === 'zisheng:pause') stop();
});
if (parent !== window) {
  const reportHeight = () => parent.postMessage({ type: 'zisheng:height', height: document.querySelector('main').offsetHeight }, location.origin);
  new ResizeObserver(reportHeight).observe(document.querySelector('main'));
  reportHeight();
}
