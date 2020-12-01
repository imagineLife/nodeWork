'use strict';
const { Writable } = require('stream');
const cWS = function(streamData){
  return new Writable({
    write(dataChunk,encoding,next){
      streamData.push(dataChunk);
      next()
    }
  })
}

const data = []
const writable = createWriteStream(data)
writable.on('finish', () => { console.log('finished writing', data) })
writable.write('A\n')
writable.write('B\n')
writable.write('C\n')
writable.end('nothing more to write')