/*
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
const { pipeline, Transform } = require('stream');

const IN_DOC = `txt.txt`
const OUT_DOC = `outgoing.txt`
const readStr = createReadStream(`./${IN_DOC}`)
const writeStr = createWriteStream(`./${OUT_DOC}`)

// DIRECT pipeline, from input to output
// pipeline(readStr, writeStr, (err,resVal)=>{
//   if(err) console.log(`err `,err)
//   console.log('no err!')
//   console.log(resVal)
// });

// Pipeline including Transform stream

const mts = ()=> {
  return new Transform({
    transform(chunk, encoding, callback) {
      let upper = chunk.toString().toUpperCase()
      return callback(null,upper)
    }
  })
}

const upperStream = mts()

pipeline(readStr, upperStream, writeStr, (err,resVal)=>{
  if(err) console.log(`err `,err)
  console.log('Done! see outgoing.txt for the transformed stream')
});
