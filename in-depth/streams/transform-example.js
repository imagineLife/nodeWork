'use strict'
const { createGzip } = require('zlib')
const encodingType = 'base64'
const timeoutVal = 3500
const gZipStream = createGzip()
function dataHandler(data){
  console.log('got gzip data', data.toString(encodingType))
}

gZipStream.on('data', dataHandler)
gZipStream.write('first')
setTimeout(() => {
  gZipStream.end('second')
}, timeoutVal)

/*
  Running this 
  got gzip data H4sIAAAAAAAAEw==
  got gzip data S8ssKi4pTk3Oz0sBAP/7ZB0LAAAA
*/ 