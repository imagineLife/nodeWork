// use with piping.js

'use strict'
const net = require('net')
const { Transform, pipeline } = require('stream')
const { scrypt } = require('crypto')
const SALT = 'custom-string';
const ENCODING_TYPE = 'hex';
const KEY_LENGTH = 32;
const BEAT_STRING = 'beat'
const BEAT_INTERVAL = 750;
const PORT = 3000;

const newTransformStream = () => {
  return new Transform({
    /*
      Whether to encode strings passed to stream.write() 
      to Buffers (with the encoding specified 
        in the stream.write() call) before passing them
         to stream._write()
    */
    decodeStrings: false,
    encoding: ENCODING_TYPE,
    transform (dataChunk, encoding, next){
      scrypt(dataChunk, SALT, KEY_LENGTH,(err,encryptedKey)=> {
        // handle error
        if(err){
          next(err)
          return;
        }
        next(null,encryptedKey)
      })
    }
  })
}

net.createServer((socket)=> {
  // use above fn
  const transStream = newTransformStream();

  // heart-beat interval
  const int = setInterval(()=> {
    socket.write(BEAT_STRING);
  }, BEAT_INTERVAL)

  // PIPE instead of on(data)
  pipeline(socket, transStream, socket, err => {
    if(err){
      console.error('SOCKET ERROR: ',err)
    }
    clearInterval(int);
    
  })
}).listen(PORT)


/*
  NOTES
  Running this WITH the piping.js client returns...
  1a1fff6f17265b98cb12e0e6107881679c2bdefe8ff5de12fc83a4bc21d3dc0bbeatbeatbeatbeat37e841399a37a662bb35d26a65e7c09da3f8fa4f6a53865bdd3bcc99a85d8929

  - first chars are derived from server saying hello!
    HELLO_TEXT
    - server wrote it to the client Duplex stream
    - emitted as data event to TCP socket Duplex stream
    - written to THIS transform stream
    derived a key using the crypto library
    - resulting str got passed, as 2nd arg, in the transform fn in the
    - 
*/ 