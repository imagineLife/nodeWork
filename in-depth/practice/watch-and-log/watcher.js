const EventEmitter = require('events');
const { watch, statSync } = require('fs');
const { join } = require('path');

const Ev = new EventEmitter()
console.log(`Event-Emitter created`);

let args = process.argv

// default vars
let WATCH_DIR = __dirname;
let LOG_FILE = __filename;
// console.log({LOG_FILE})
// console.log({WATCH_DIR})

function applyArgToCurDir(str){
  let argVal = str.substring(6);
    return `${__dirname}/${argVal}`
}

if(args.length > 2){
  args.forEach((a, argIdx) => {
    // skip default args
    if(argIdx < 2) return;

    if(a.includes(`--DIR`)){
      WATCH_DIR = applyArgToCurDir(a)
    }

    if(a.includes(`--LOG`)){
      LOG_FILE = applyArgToCurDir(a)
    }
  }) 
}

watch(WATCH_DIR, (e, fileName) => {
  console.log({fileName})
  // get change-times of the file
  // const { ctimeMs, mtimeMs } = statSync(join(WATCH_DIR, fileName))
  const stats = statSync(join(WATCH_DIR, fileName))
  console.log({stats})
  // console.log({mtimeMs})
  
})