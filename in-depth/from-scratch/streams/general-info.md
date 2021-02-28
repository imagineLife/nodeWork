<!--
- Know 5 'major' Types of streams
  - know other node core APIs that are also streams
- Know the main events on a stream
- Know the 2 stream modes
  - they read different things
- Know what streams inherit from
 -->

## General Info

### 5 Types of streams

- Readable
- Writable
- Duplex
- Transform
- ...Stream?!

### Node apis that are streams

- fs has a few
  - createReadStream
  - createWriteStream
- process.stdio
  - stdin
  - stdout
- child-processes
- http/https

### Main Stream Events

- data
  - when data is being passed
- end/finished
  - depends on the implementation, but at the end of the stream
- error

### Stream Modes

- Object mode
- Stream/binary mode
- streams inherit from eventEmitter
