'use strict';
const net = require('net');

/*
  Finished
  A function to get notified 
   when a stream is no longer readable, 
   writable or has experienced an error 
   or a premature close event.
   https://nodejs.org/api/stream.html#stream_stream_finished_stream_options_callback
*/ 

const { finished } = require('stream')

net.createServer((socket) => {
  
  // write a heart-beat
  const int = setInterval(() => {
    socket.write('heart-beat')
  });
  
  //write data on data
  socket.on('data', d => socket.write(d.toString().toUpperCase()))

  finished(socket, err => {
    if(err) console.error(`socket err:`, err);
    clearInterval(int);
  })

})