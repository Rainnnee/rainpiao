// The exported U-Net is Rain's trained checkpoint, not a font renderer.
const runtimeURL = new URL('../../assets/vendor/onnxruntime/', import.meta.url);
const modelURL = new URL('../../assets/models/zisheng/denoiser.onnx', import.meta.url);
let ort, session, backend;
let gpuError = '';

function random(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function gaussian(rng, length) {
  const result = new Float32Array(length);
  for (let i = 0; i < length; i += 2) {
    const radius = Math.sqrt(-2 * Math.log(Math.max(rng(), Number.EPSILON)));
    const angle = 2 * Math.PI * rng();
    result[i] = radius * Math.cos(angle);
    result[i + 1] = radius * Math.sin(angle);
  }
  return result;
}

async function initialize(forceCPU = false) {
  if (session) return;
  postMessage({ type: 'status', message: 'Loading the model and inference engine…' });
  ort = await import(new URL('ort.webgpu.min.mjs', runtimeURL).href);
  ort.env.wasm.wasmPaths = runtimeURL.href;
  // A single worker/thread also works on GitHub Pages without special headers.
  ort.env.wasm.numThreads = 1;
  const options = { graphOptimizationLevel: 'all' };
  if (navigator.gpu && !forceCPU) {
    try {
      postMessage({ type: 'status', message: 'Preparing GPU inference…' });
      session = await ort.InferenceSession.create(modelURL.href, { ...options, executionProviders: ['webgpu', 'wasm'] });
      backend = 'WebGPU';
    } catch (error) { gpuError = String(error.message || error); }
  }
  if (!session) {
    postMessage({ type: 'status', message: 'Preparing CPU inference…' });
    try { session = await ort.InferenceSession.create(modelURL.href, { ...options, executionProviders: ['wasm'] }); }
    catch (error) { throw new Error(`${gpuError} ${error.message || error}`); }
    backend = 'WebAssembly';
  }
}

function frame(image, remaining, completed, total) {
  const pixels = Uint8Array.from(image, v => Math.round(Math.min(1, Math.max(-1, v)) * 127.5 + 127.5));
  postMessage({ type: 'frame', pixels, remaining, completed, total }, [pixels.buffer]);
}

onmessage = async event => {
  const { character, seed, steps } = event.data;
  if (!Number.isInteger(character) || character < 0 || character > 11 ||
      !Number.isInteger(seed) || seed < 0 || seed > 4294967295 || ![60, 100, 1000].includes(steps)) {
    postMessage({ type: 'error', message: 'Choose a supported character, seed, and step count.' });
    return;
  }
  try {
    const rng = random(seed);
    let image = gaussian(rng, 48 * 48);
    frame(image, 1000, 0, steps);
    await initialize(event.data.cpu === true);
    postMessage({ type: 'backend', backend });
    // Keep the trained 1000-step noise schedule. DDIM chooses fewer evaluation
    // points on it; changing the number of training timesteps would be wrong.
    const alphaBars = new Float64Array(1000);
    let product = 1;
    for (let t = 0; t < 1000; t++) {
      product *= 1 - (0.0001 + t / 999 * (0.02 - 0.0001));
      alphaBars[t] = product;
    }
    const original = steps === 1000;
    const schedule = original ? Array.from({ length: 1000 }, (_, i) => 999 - i) :
      Array.from({ length: steps }, (_, i) => Math.round(999 * (1 - i / (steps - 1))));
    const started = performance.now();
    for (let i = 0; i < schedule.length; i++) {
      const t = schedule[i];
      const feeds = {
        image: new ort.Tensor('float32', image, [1, 1, 48, 48]),
        timestep: new ort.Tensor('int64', BigInt64Array.of(BigInt(t)), [1]),
        character: new ort.Tensor('int64', BigInt64Array.of(BigInt(character)), [1]),
      };
      const outputs = await session.run(feeds);
      const epsilon = outputs.noise.data;
      const a = alphaBars[t], previous = i + 1 < steps ? alphaBars[schedule[i + 1]] : 1;
      const next = new Float32Array(image.length);
      if (original) {
        // Same epsilon-parameterized DDPM mean and posterior variance as
        // zisheng/diffusion.py. Every reverse step gets fresh Gaussian noise.
        const beta = 0.0001 + t / 999 * (0.02 - 0.0001);
        const alpha = 1 - beta;
        const variance = Math.max(1e-20, beta * (1 - (t ? alphaBars[t - 1] : 1)) / (1 - a));
        const noise = t ? gaussian(rng, image.length) : null;
        for (let j = 0; j < image.length; j++) {
          const mean = (image[j] - beta / Math.sqrt(1 - a) * epsilon[j]) / Math.sqrt(alpha);
          next[j] = mean + (noise ? Math.sqrt(variance) * noise[j] : 0);
        }
      } else {
        for (let j = 0; j < image.length; j++) {
          const clean = Math.max(-1, Math.min(1, (image[j] - Math.sqrt(1 - a) * epsilon[j]) / Math.sqrt(a)));
          const corrected = (image[j] - Math.sqrt(a) * clean) / Math.sqrt(1 - a);
          next[j] = Math.sqrt(previous) * clean + Math.sqrt(1 - previous) * corrected;
        }
      }
      if (next.some(value => !Number.isFinite(value))) throw new Error('The sampler produced an invalid value.');
      Object.values(feeds).forEach(tensor => tensor.dispose());
      outputs.noise.dispose();
      image = next;
      if (!original || t % 10 === 0) frame(image, original ? t : (i + 1 < steps ? schedule[i + 1] + 1 : 0), i + 1, steps);
    }
    postMessage({ type: 'complete', backend, sampler: original ? 'DDPM · 1,000 steps' : `DDIM · ${steps} steps`, seconds: (performance.now() - started) / 1000 });
  } catch (error) {
    console.error('Zisheng sampler:', error);
    postMessage({ type: 'error', message: 'This browser could not run the model. You can still explore the recorded example below.', detail: String(error.message || error) });
  }
};
