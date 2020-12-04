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

*/ 