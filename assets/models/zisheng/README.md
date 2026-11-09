# Zisheng browser checkpoint

An ONNX export of Rain Piao’s public Zisheng visual-pilot checkpoint, not a newly trained model. Source: https://github.com/Rainnnee/zisheng at `aff9ffde4c26000b8c1d6c1db65a73ad7059b764`. The owner supplied and requested this website integration. The source project has not selected a code/checkpoint license; this export does not assign one.

`manifest.json` records source/export hashes, architecture, labels, and numerical parity checks. Recreate with `scripts/export-zisheng.py` using the source project’s Python environment plus ONNX and ONNX Runtime. `scripts/record-zisheng.py` recreates the clearly labeled static replay, independently of the vector banner.

The default browser sampler follows the original 1,000-step DDPM update. Optional DDIM uses the same trained noise predictor on a shorter sequence of the original alpha schedule. Seeds are reproducible within the same implementation/backend; JavaScript and PyTorch random-number streams are different. Samples are qualitative, not a recognition benchmark.
