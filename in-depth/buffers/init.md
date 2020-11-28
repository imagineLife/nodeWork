# Buffers

[MDN writing on Buffers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)

There are several buffer types in js...

- `ArrayBuffer`
  - can be accessed with a few differenet typed arrays:
    - `Float64Array`
      - each set of 8 bytes is interpreted as a 64-bit floating number
    - `Int32Array`
      - each 4 bytes represents a 32-bit two's compliment signed integer
    - `Uint8Array`
      - each byte represents an unsigned integer btw 0 - 255
  - **NOTE** calling `Array.isArray` on one of thes etyped arrays returns `false`
  - JS `Buffer` is a 'subclass' of JS's `Uint8Array`
