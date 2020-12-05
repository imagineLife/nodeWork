// use with piping.js

'use strict'
const net = require('net')
const { Transform, pipeline } = require('stream')
const { scrypt } = require('crypto')
const SALT = 'custom-string';
const ENCODING_TYPE = 'hex';
const KEY_LENGTH = 32;
const BEAT_STRING = 'heart-beat'
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