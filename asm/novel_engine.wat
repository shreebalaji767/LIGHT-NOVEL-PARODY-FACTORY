;; LIGHT NOVEL PARODY FACTORY
;; Minimal browser-safe low-level engine prototype.
;; Exported functions are intentionally tiny; the JavaScript prototype
;; remains responsible for text tables until the full generator is ported.

(module
  (global $seed (mut i32) (i32.const 123456789))

  (func $random_u32 (export "random_u32") (result i32)
    global.get $seed
    i32.const 1664525
    i32.mul
    i32.const 1013904223
    i32.add
    global.set $seed
    global.get $seed)

  (func $set_seed (export "set_seed") (param $value i32)
    local.get $value
    global.set $seed)
)
