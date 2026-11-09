# ONNX Runtime Web 1.31.1

Production files copied from the official `onnxruntime-web@1.31.1` npm package: https://registry.npmjs.org/onnxruntime-web/-/onnxruntime-web-1.31.1.tgz

The WebGPU module uses the asyncify loader/binary. Files are served locally and loaded only after the visitor requests model inference. One WASM thread avoids a cross-origin isolation requirement on GitHub Pages. MIT license and ThirdPartyNotices.txt are from the matching official Microsoft repository tag.

For browser compatibility checks, `/demos/zisheng/?cpu=1` forces the worker to use WebAssembly instead of WebGPU. It changes only the execution backend, not the model or sampler.
