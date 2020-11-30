# Streams
[Node Docs](https://nodejs.org/api/stream.html)  
There are several stream constructors available through the node api:
- Stream
- Readable
- Writable
- Duplex
- Transform

**Other Node APIs also expose Streams**...
- process
- net
- http
- fs
- child_process

Streams inherit the `EventEmitter` from the `events` module. The `stream` module, itself (_the most 'raw' stream api_) is not often directly used. `stream` implements the `pipe` method.

## Stream event names
- data
  - on readable streams
- end
  - on readable streams
- finish
  - on writable streams
- close
  - common to all streams
  - emitted when 
- error
  - common to all streams
  - emitted when a stream encounters an error

## Stream Modes
- streams have 'modes'
- `all streams operate exclusively on strings and Buffer objects`[Object mode docs](https://nodejs.org/api/stream.html#stream_object_mode)
  - SWITCHING an existing stream to object mode is not safe
- `objectMode` 
  - default value is `false`
    - default mode is binary
    - binary-mode streams read Buffer instances
  - when value is `true`, in object mode
    - Here, the stream can read/write JS primitive values (_except null_)

## Readable Streams
`readable-example.js`
- can be used to read data from...
  - a file
  - http requests
  - user-input in a cli
`contrived-read-stream.js` is a...contrived readStream