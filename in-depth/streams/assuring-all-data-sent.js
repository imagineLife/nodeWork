'use strict'
const {
	Readable,
	Writable
} = require('stream')

const assert = require('assert')

const createWritable = () => {
	// internal 'state'
  const sink = []
	let piped = false

	// the ASSERTION tests, assuring all data matches incoming && piped
  setImmediate(() => {
		assert.strictEqual(piped, true, 'use the pipe method')
		assert.deepStrictEqual(sink, ['a', 'b', 'c'])
	})
	
  // writable constructor
  const writable = new Writable({
		decodeStrings: false,
		write(chunk, enc, cb) {
			sink.push(chunk) 
      cb()
		},
		final() {
			console.log('passed!')
		}
	})
	writable.once('pipe', () => {
		piped = true
	})
	return writable
}
const readable = Readable.from(['a', 'b', 'c'])
const writable = createWritable()

readable.pipe(writable)