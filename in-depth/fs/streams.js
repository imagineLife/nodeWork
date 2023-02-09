const { pipeline } = require('stream');
const { join } = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { Transform } = require('stream');
const STREAM_INPUT_FILENAME = __filename;
const STREAM_OUTPUT_FILENAME = 'stream-out.txt';
const UPPERCASE_OUTPUT_FILENAME = 'out-upper-stream.txt'

console.log(`reading a stream from ${STREAM_INPUT_FILENAME} to ${STREAM_OUTPUT_FILENAME}`);

function handlePipelineError(err) {
  if(err){
    console.error(err);
    return;
  }
  console.log('finished writing stream!')
}

pipeline(
  createReadStream(__filename),
  createWriteStream(join(__dirname, STREAM_OUTPUT_FILENAME)),
  handlePipelineError
);

/*
  Good for...
  - Large-files
  - low memory usage
  - 
*/ 


// Levearging Transform stream between files
function createUpperCaseStream(){
  return new Transform({
    transform(chunk, enc, nxt) {
      console.log('upper chunk here')
      
      const upd = chunk.toString().toUpperCase()
      nxt(null,upd);
    }
  })
}

pipeline(
  createReadStream(__filename),
  createUpperCaseStream(),
  createWriteStream(join(__dirname, UPPERCASE_OUTPUT_FILENAME)),
  handlePipelineError
);