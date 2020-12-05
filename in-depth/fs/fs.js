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
const CONTENTS = readFileSync(__filename);
console.log({CONTENTS})
