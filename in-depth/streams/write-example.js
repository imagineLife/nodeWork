'use strict';
const fs = require('fs');
const fileToWriteTo = './write-output';
const finishHandler = () => { console.log('finished writing') };
const writable = fs.createWriteStream(fileToWriteTo)
writable.on('finish', finishHandler)
writable.write('A\n')
writable.write('B\n')
writable.write('C\n')
writable.end('nothing more to write')