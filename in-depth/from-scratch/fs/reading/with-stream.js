const { createReadStream } = require('fs')

const FILE_PATH = './demo-file.txt';

const fileStream = createReadStream(FILE_PATH, {encoding: 'utf8'})
let chunks = 1;
fileStream.on('data', d => {
  console.log(chunks)
  chunks++;
})

fileStream.on('close', d => console.log('closed'))
