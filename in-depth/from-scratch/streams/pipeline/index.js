/*

  REQUIRES
  a sibling `txt.txt` file, containing text

  Leverage the pipeline api
  - build a readable stream from a file `incoming.txt`
  - in the file put 4 paragraphs of lorem ipsum from [a generator](https://www.lipsum.com/)
  - upper-case the incoming stream
  - send the uppercased results to an output file `outgoing.txt`
*/ 

const { 
  createReadStream, 
  createWriteStream 
} = require('fs');

const { 
  pipeline, 
  Transform 
} = require('stream');

const { createGzip, createGunzip } = require('zlib');

const IN_DOC = `txt.txt`
const SMALL_IN_DOC = `txt-small.txt`
const OUT_DOC = `outgoing.txt`
const SMALL_OUT_DOC = `outgoing_small.txt`

// const txtReadStream = createReadStream(`./${IN_DOC}`)
// const writeStr = createWriteStream(`./${OUT_DOC}`)

const readWriteStr = createReadStream(`./${OUT_DOC}`)
const writeDeCompressedFile = createWriteStream(`./${SMALL_OUT_DOC}`)


// DIRECT pipeline, from input to output
// pipeline(txtReadStream, writeStr, (err,resVal)=>{
//   if(err) console.log(`err `,err)
//   console.log('no err!')
//   console.log(resVal)
// });

// Pipeline including Transform stream

// const mts = ()=> {
//   return new Transform({
//     transform(chunk, encoding, callback) {
//       let upper = chunk.toString().toUpperCase()
//       return callback(null,upper)
//     }
//   })
// }

// const upperStream = mts()

// pipeline(txtReadStream, upperStream, writeStr, (err,resVal)=>{
//   if(err) console.log(`err `,err)
//   console.log('Done! see outgoing.txt for the transformed stream')
// });




// Pipeline including Compression
// const zipStream = createGzip()

// pipeline(txtReadStream, zipStream, writeStr, (err,resVal)=>{
//   if(err) console.log(`err `,err)
//   console.log('Done! see outgoing.txt for the transformed stream')
// });





// Pipeline including decompression
// @NOTE run the above compression one first
// @NOTE assure only the file-stream constants that are needed are uncommented @ top of the file
const unzipStream = createGunzip()

// NO DICE
// try{
//   readWriteStr.pipe(unzipStream).pipe(writeDeCompressedFile) 
// }catch(e){
//   console.log('caught error')
//   console.log(e)
// }

pipeline(readWriteStr, unzipStream, writeDeCompressedFile, (err,resVal)=>{
  if(err){
    console.log(`err `,err)
  }else{
    console.log('Done! see outgoing.txt for the transformed stream')
  }
});