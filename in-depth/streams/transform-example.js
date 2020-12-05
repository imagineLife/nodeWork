'use strict'
// const { createGzip } = require('zlib')
// const encodingType = 'base64' //hex
// const timeoutVal = 500
// const gZipStream = createGzip()
// function dataHandler(data){
//   console.log('got gzip data', data.toString(encodingType))
// }

// gZipStream.on('data', dataHandler)
// gZipStream.write('first')
// setTimeout(() => {
//   gZipStream.end('second')
// }, timeoutVal)

/*
  Running this 
  got gzip data H4sIAAAAAAAAEw==
  got gzip data S8ssKi4pTk3Oz0sBAP/7ZB0LAAAA
*/ 

const { Transform } = require('stream')
const { scrypt } = require('crypto')
const createTransformStream = () => {
  return new Transform({
    decodeStrings: false,
    encoding: 'hex',
    transform (chunk, enc, next) {
      scrypt(chunk, 'a-salt', 32, (err, key) => {
        if (err) {
          next(err)
          return
        }
        next(null, key)
      })
    }
  })
}
const transform = createTransformStream()
transform.on('data', (data) => {
  console.log('got data:', data)
})
transform.write('A\n')
transform.write('B\n')
transform.write('C\n')
transform.end('nothing more to write')