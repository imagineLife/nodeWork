const { readFileSync, writeFileSync } = require('fs');
const { join } =require('path');
/*
  SYNCHRONOUS METHODS
  - BLOCK the thread until finished
  - may be convenient for app-loading processes
  - ERRORS thorw, SO this stuff needs to be wrapped in try/catch to handle errors
*/
/*
  Read Current file && log the results
  Logs a buffer
  <Buffer ....>
*/ 
const BUFFERED_CONTENT = readFileSync(__filename);
console.log({BUFFERED_CONTENT})

/*
  Read Current file && log the results
  Logs the readable content as strings with breaks etc
*/ 
const ENCODED_CONTENT = readFileSync(__filename, {encoding: 'utf8'});
console.log({ENCODED_CONTENT})

/*
  WRITE to a new file, takes 3 params here
  - the file path
  - the file name
  - the file content
*/ 
const OUTPUT_FILE_NAME = 'output.txt'
writeFileSync(join(__dirname,OUTPUT_FILE_NAME), ENCODED_CONTENT.toUpperCase());

// the 'a' flag ADDS if the file already has content
// 'append' mode
writeFileSync(join(__dirname,OUTPUT_FILE_NAME), ENCODED_CONTENT.toUpperCase(), {
  flag: 'a'
})

// SEE ALL FS FLAGS
// https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_file_system_flags