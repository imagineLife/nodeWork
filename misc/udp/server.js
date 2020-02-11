/*
	UDP
	https://nodejs.org/api/dgram.html#dgram_udp_datagram_sockets
	dataGram sockets
*/
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

const handleStream = (messageBuffer,sender) => {
  // Do something with an incoming message or the sender
  var stringified = messageBuffer.toString();
  console.log(stringified);
}

server.on('message', handleStream);

// Bind to 6000
server.bind(6000);