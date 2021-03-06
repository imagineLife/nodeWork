'use strict'
const {
	Readable,
	Writable,
	Transform,
	PassThrough,
	pipeline
} = require('stream') 
const assert = require('assert') 

const transChunk = chunk => chunk.toString().toUpperCase();

const createTransformStream = () => {
  return new Transform({
		// MUST set this as the content passed to the readable, below, is an arr
		objectMode: true,
		// call transform on the incoming chunks
    transform (chunk, enc, next) {
			const transformedChunk = transChunk(chunk)
        next(null, transformedChunk)
    }
  })
}

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
const readable = Readable.from(['a', 'b', 'c']) 
const writable = createWritable() 

// TODO: replace the pass through stream
// with a transform stream that uppercases
// incoming characters

// WAS just
// const transform = new PassThrough()

// NOW refernces the createStream fn above
const transform = createTransformStream()

pipeline(readable, transform, writable, (err) => {  
	assert.ifError(err)  
	assert.deepStrictEqual(writable.sink, ['A', 'B', 'C']) 
	console.log('passed!')
})