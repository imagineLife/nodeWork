/*
  Synchronous Methods
  - BLOCK the thread until finished
  - maybe convenient for app-loading processes
*/

const { readFileSync } = require('fs');

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