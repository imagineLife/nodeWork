// A Duplex Stream
// A TCP server, awaiting incoming connection requests
// CONNECT RUNNING tcp-client.js
'use strict'
const heartBeatInterval = 1100;
const heartBeatString = 'heart-beat'
const net = require('net');

// server fn
function serverFn(socket){
  const int = setInterval(() => {
    socket.write(heartBeatString)
  }, heartBeatInterval)

  socket.on('data', function(d){
    socket.write(d.toString().toUpperCase())
  })
  socket.on('end',() => {clearInterval(int)})
}

// initialize server
net.createServer(serverFn).listen(3000)