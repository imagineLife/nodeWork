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
- The Readable Constructor
  - Inherits the Stream Constructor - Inherits the EventEmitter
    `contrived-read-stream.js` is a...contrived readStream
    `read-stream-with-encoding.js` is another example
- the encoding changes the way the stream is ... encoded
  - **readable streams emit buffers by default**
    - most use-cases for readable streams deal with binary data

## Writable Streams

- can be used to write data to...
  - a file
  - an http response
  - the terminal
- The Writable Constructor
  - Inherits the Stream Constructor
    - Inherits the EventEmitter

`write-example.js`

## Read-Write Streams

### Duplex

- inhertis Readable constructor
- 'mixes' functionality from the Writable constructor
- read && write methods are implemented
- `duplex-example.js`
  - createServer has a listener for each client that connects
    - the listener fn gets passed the Duplex stream (_code refers to the duplex stream as `socket`_)
  - every `1s`
    - a string is written to the stream `heartbeat`, using `socket.write`
      - this leverages the writable part of the duplex stream
  - the `data` & `end` events are listened for, leveraging the `readable` part of the duplex
    - `data` writes to the stream
      - sends back the INCOMING data after upper-casing it
    - `end` "cleans-up" the setInterval resource after the client disconnects
- `tcp-client.js`, a client talking to the above duplex example
  - `connectedNet` returns the Duplex stream, the TCP client socket
  - listen for a `data` event, logging the incoming data buffer (_as a string_)
    - leveraging the readable Duplex element
  - `socket.write` leverages the writable stream of the duplex
    - writes `finished` after the `killAfterTime` is triggered
    - after another `shortTime`, kill the connection using `socket.end`

### Transform

- inherits from the `Duplex` constructor
- `A Transform stream is a Duplex stream where the output is computed in some way from the input(i.e zlib, crypto streams that compress, encrypt, or decrypt data)`
  - output is not expected to have ANY same characteristics as input
  - hash stream is always only 1 output && only
  - zlib stream output is always a different size than stream input
- `transform-example.js`
  - 2nd part
    - the `Transform` constructor uses a `transform` option, which performs similarly to the `write` in the writable streams
    - `transform` takes extra option `next`, which

### PassThrough

- inherits the `Transform` constructor
- **no transformation is applied**
- like... `val => val`
-

## Catching the End Of A Stream

- Close event
- error event
- finish event
- end event

see `catching-end.js`
