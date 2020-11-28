# Buffers

There are several buffer types in js...

- `ArrayBuffer`
  - can be accessedd with a `Float64Array`
    - each set of 8 bytes is interpreted as a 64-bit floating number
  - `Int32Array`
    - each 4 bytes represents a 32-bit two's compliment signed integer
  - `Uint8Array`
    - each byte represents an unsigned integer btw 0 - 255
  - **NOTE** calling `Array.isArray` on one of thes etyped arrays returns `false`
  -
