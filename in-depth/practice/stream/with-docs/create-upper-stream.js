'use strict'
const { 
  Readable, 
  Writable, 
  Transform, 
  PassThrough, 
  pipeline 
} =require('stream')
const assert = require('assert')
const createWritable = () => {  
  const sink = []  
  const writable = new Writable({    
    write(chunk, enc, cb) {
      sink.push(chunk.toString())      
      cb()
    }  
  })  
  writable.sink = sink  
  return writable
}

const aSmall = ['a', 'b', 'c','d','e','f'];

const aBig = [];
aSmall.forEach(itm => {
  aBig.push(itm.toUpperCase())
})

const readable = Readable.from(aSmall)
const writable = createWritable() 

/*
  Here,
  build a transform stream
   that uppercases all chunks
*/
// const transform = new PassThrough()
const transform = new Transform({
   writableObjectMode: true,

  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
})

pipeline(
  readable, 
  transform, 
  writable, (err) => {
    assert.ifError(err)
    assert.deepStrictEqual(writable.sink,  aBig)
    console.log('passed!')
  }
)