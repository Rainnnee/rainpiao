"""Export Rain's existing Zisheng pilot, without retraining or changing its weights.

Run with the Zisheng Python environment (torch, onnx, onnxruntime, numpy):
  python scripts/export-zisheng.py /path/to/zisheng
This only reads the source project. Output belongs to this portfolio.
"""
import hashlib
import json
from pathlib import Path
import sys

import numpy as np
import onnx
import onnxruntime as ort
import torch

source = Path(sys.argv[1]).resolve()
sys.path.insert(0, str(source / "src"))
from zisheng.model import ConditionalDenoiser
from zisheng.data import PILOT_CHARACTERS

root = Path(__file__).resolve().parents[1]
out = root / "assets/models/zisheng"
out.mkdir(parents=True, exist_ok=True)
checkpoint = source / "demo/assets/expanded-12char-48px/zisheng-pilot.pt"
saved = torch.load(checkpoint, map_location="cpu", weights_only=True)
model = ConditionalDenoiser(num_classes=12).eval()
model.load_state_dict(saved["model_state_dict"])
torch.set_num_threads(2)
torch.manual_seed(81)
inputs = (torch.randn(1, 1, 48, 48), torch.tensor([731]), torch.tensor([4]))
path = out / "denoiser.onnx"
torch.onnx.export(model, inputs, path, input_names=["image", "timestep", "character"],
                  output_names=["noise"], opset_version=17, dynamo=False)
onnx.checker.check_model(onnx.load(path))
options = ort.SessionOptions()
options.intra_op_num_threads = 2
session = ort.InferenceSession(str(path), sess_options=options, providers=["CPUExecutionProvider"])
errors = []
with torch.inference_mode():
    for t, char in [(0, 0), (100, 4), (731, 11), (999, 7)]:
        x = torch.randn(1, 1, 48, 48)
        time, label = torch.tensor([t]), torch.tensor([char])
        expected = model(x, time, label).numpy()
        actual = session.run(None, {"image": x.numpy(), "timestep": time.numpy(), "character": label.numpy()})[0]
        error = float(np.abs(actual - expected).max())
        assert np.allclose(expected, actual, atol=3e-5, rtol=3e-4), error
        errors.append(error)

manifest = {
    "source": "https://github.com/Rainnnee/zisheng",
    "sourceCommit": "aff9ffde4c26000b8c1d6c1db65a73ad7059b764",
    "checkpointSha256": hashlib.sha256(checkpoint.read_bytes()).hexdigest(),
    "onnxSha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    "bytes": path.stat().st_size, "parameters": sum(p.numel() for p in model.parameters()),
    "imageSize": 48, "timesteps": 1000, "betaStart": 0.0001, "betaEnd": 0.02,
    "characters": [{"glyph": c.glyph, "id": c.class_id, "strokes": c.stroke_count, "meaning": c.gloss} for c in PILOT_CHARACTERS],
    "training": {"images": 3072, "updates": 8000, "fonts": 2, "emaDecay": 0.995},
    "validation": {"cases": 4, "maximumAbsoluteError": max(errors)},
    "browserSampler": "Default: original 1000-call DDPM update, streaming 101 states. Optional: deterministic DDIM eta=0 with 60 or 100 calls. Same checkpoint; JavaScript RNG differs from PyTorch.",
    "status": "Qualitative pilot; no measured recognition accuracy or held-out-font result.",
}
(out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"bytes": manifest["bytes"], "parameters": manifest["parameters"], "maxError": max(errors)}))
