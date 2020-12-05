const { readFileSync, writeFileSync } = require('fs');
const { join } =require('path');
/*
  SYNCHRONOUS METHODS
  - BLOCK the thread until finished
  - maybe convenient for app-loading processes
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
const OUTPUT_FILE_NAME = 'output.txt'
writeFileSync(join(__dirname,OUTPUT_FILE_NAME), ENCODED_CONTENT.toUpperCase());