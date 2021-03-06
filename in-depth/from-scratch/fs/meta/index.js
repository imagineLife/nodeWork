const { statSync } = require('fs');
const { join } = require('path');

const FILE_STR = `./demo-file.txt`;
const FILE_PATH = join(FILE_STR);

const { 
  atimeMs, 
  mtimeMs,
  ctimeMs,
  birthtimeMs
} = statSync(FILE_PATH)
console.log({
  lastAccessed: atimeMs,
  lastMod: mtimeMs,
  changed: ctimeMs,
  born: birthtimeMs
})
