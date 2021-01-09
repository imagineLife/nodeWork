/*
  From Scratch
  - Read from a file
  - compress the text
  - store in big-text.txt.gz
*/ 

const start = new Date()
// Dependencies
const { createGzip } = require('zlib');
const { pipeline } = require('stream')
const {
  createReadStream,
  createWriteStream
} = require('fs');

// Vars
const SOURCE_FILE = 'big-text.txt';
const DEST_FILE = 'big-text.txt.gz';

const SRC_STREAM = createReadStream(SOURCE_FILE);
const DEST_STREAM = createWriteStream(DEST_FILE);

const gz = createGzip()
pipeline(
  SRC_STREAM,
  gz,
  DEST_STREAM, (err) => {
    if(err){
      console.error(`PIPELINE ERR: `, err)
      process.exitCode = 1;
    }
    const done = new Date()
    console.log("Done In ",done - start);
  }
)