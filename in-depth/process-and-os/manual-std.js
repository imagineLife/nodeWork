const fs = require('fs');
const stdOut = fs.createWriteStream(null, {fd:1})
const stdErr = fs.createWriteStream(null, {fd: 2});

stdOut.write('wrote to cmd line')
stdErr.write('wrote to Err line')