const { readdir } = require('fs');
const { join } = require('path')

const FILE_PATH_STR = './'
const HERE = join(FILE_PATH_STR)

readdir(HERE, (err,files) => {
  console.log('files')
  console.log(files)
})