const { pipeline } = require('stream');
const { join } = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { Transform } = require('stream');

function handlePipelineError(err){
  if(err){
    console.error(err);
    return;
  }
  console.log('finished writing stream!')
}

pipeline(
  createReadStream(__filename),
  createWriteStream(join(__dirname,'stream-out.txt')),
  handlePipelineError
)

/*
  Good for...
  - Large-files
  - low memory usage
  - 
*/ 


// Levearging Transform stream between files
const createUpperCaseStream = () => {
  return new Transform({
    transform (chunk, enc, nxt){
      const upd = chunk.toString().toUpperCase()
      nxt(null,upd);
    }
  })
}

pipeline(
  createReadStream(__filename),
  createUpperCaseStream(),
  createWriteStream(join(__dirname, 'out-upper-stream.txt')),
  handlePipelineError
)