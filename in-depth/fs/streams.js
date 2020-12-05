const { pipeline } = require('stream');
const { join } = require('path');
const { createReadStream, createWriteStream } = require('fs');

pipeline(
  createReadStream(__filename),
  createWriteStream(join(__dirname,'stream-out.txt')),
  err => {
    if(err){
      console.error(err);
      return;
    }
    console.log('finished writing stream!')
  }
)