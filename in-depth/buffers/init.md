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

## Example and Notes

`ex.js`

- create 2 arrays, one using the `Buffer` api and another using the `Uint8Array`
- upating the `Buffer` instance changes the same piece of memory
- updating the `Uint8Array` creates a new piece of memory

## Allocating buffers

- `Buffer.alloc(<number-of-bytes-here>)`
- buffers are created and allocated from unallocated memory

### Alocating unsafe buffers

- `Buffer.allocUnsafe(10)`
- this returns a different buffer of garbage bytes each time it is created
- strongly recommended against

## Note on cleaning buffers

- buffers are unlinked, not wiped
  - an allocated buffer can contain fragments of previously deleted data
