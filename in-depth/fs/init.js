/*
2 focused modules
- fs
- path
  - for normalizing path manipulation between platforms
  - 
*/ 
const { join } = require('path');



// LOCATE whatever the cur file is being executed from
// shows current file path
console.log({fileName: __filename})

// shows directory of current file
console.log({dirname: __dirname})

// create a new path to a new file
const NEW_FILE_NAME = 'new-file.txt'
const newFilePath = join(__dirname, NEW_FILE_NAME)
console.log({newFilePath})