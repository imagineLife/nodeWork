const fs = require('fs')

const fileToRead = process.argv[2]
const fileContent = fs.readFileSync(fileToRead, 'utf8')
const linesInFile = fileContent.split('\n').length - 1
console.log(linesInFile);