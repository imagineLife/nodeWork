/*
  Piping 
  available in bash...
  `cat source-file | grep find-someting`
    - pipe...
      - reads the OUTPUT from the left 
      - writed to the right-side command
  same principle in node with .pipe

A TCP Client(server) with PIPE instead of .on(data)
*/ 

'use strict'
// dependencies
const net = require('net')

// vars
const PORT = 3000
const HELLO_TEXT = "hello there!"
const DONE_TEXT = "all done"
const PROCESS_LENGTH = 3250
const SHORT_INTERVAL = 250

const socket = net.connect(PORT)

/* 
PIPING incoming to console replaces...
socket.on('data', (data) => {
  console.log('got data:', data.toString())
})
*/ 
socket.pipe(process.stdout)

socket.write(HELLO_TEXT)
setTimeout(() => {
  socket.write(DONE_TEXT)

  setTimeout(() => {
    socket.end()
  }, SHORT_INTERVAL)

}, PROCESS_LENGTH)



/*
NOTES
- process.stdout is a writable stream
  - console.log AUTO adds a new-line @ end!! interesting!
- PIPE 
  - only exists on readaable streams
    - socket, above, is a Duplex
      - duplex inherits from Readable
- PIPE
  - above, is passed a writable stream
- PIPE
  - sets up a 'data' listener on the stream
  - automatically writes to the writable stream
  - returns a stream
  - can be chained
    - sourceStream.pipe(goalStreamA).pipe(goalStreamB)
    - this is common
    - PROBLEMATIC if middle stream fails or clses
    - the BETTER way to pipe a bunch is to use the PIPELINE utility fn
*/ 