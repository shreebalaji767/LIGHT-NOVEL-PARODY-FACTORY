# Browser engine

A normal CPU Assembly program cannot execute directly inside a web browser. The browser execution target is WebAssembly.

This folder is reserved for the low-level engine. The browser-safe representation is WebAssembly text (WAT), which is assembled into novel_engine.wasm.

The intended pipeline is:

Assembly-style low-level engine -> WebAssembly module -> browser

The UI remains static and IndexedDB remains local-only.
