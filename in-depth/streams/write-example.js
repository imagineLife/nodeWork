'use strict';
const fs = require('fs');
const fileToWriteTo = './write-output';
const finishHandler = () => { console.log('finished writing') };
const writable = fs.createWriteStream(fileToWriteTo)
writable.on('finish', finishHandler)
writable.write('A\n')
writable.write('B\n')
writable.write('C\n')
writable.end('nothing more to write')



/*
  Accepting More than strings && buffers
  - streams only work with String + Buffers by default
  - set `objectMode: true` in the Writable Constructor && now 
    the stream can take in & write MORE types of data
*/ 
'use strict'
const { Writable } = require('stream')
const makeWriteStream = (d) => {
  return new Writable({
    objectMode: true,
    write (chunk, enc, next) {
      d.push(chunk)
      next()
    }
  })
}
const dataArr = []
const objModeStream = makeWriteStream(dataArr)
const finishAndLog = () => { console.log('finished writing', dataArr) }
objModeStream.on('finish', finishAndLog)
objModeStream.write('A\n')
objModeStream.write(1)
objModeStream.write(false)
objModeStream.end('nothing more to write')
