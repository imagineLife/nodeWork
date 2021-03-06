const { createReadStream } = require('fs')

const FILE_PATH = './demo-file.txt';

const fileStream = createReadStream(FILE_PATH, {encoding: 'utf8'})
fileStream.on('data', d => {
  console.log(d)
})

fileStream.on('close', d => console.log('closed'))
