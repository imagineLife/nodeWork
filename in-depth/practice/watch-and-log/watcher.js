const EventEmitter = require('events');

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
      console.log(`watching ${WATCH_DIR}`)
    }

    if(a.includes(`--LOG`)){
      LOG_FILE = applyArgToCurDir(a)
      console.log(`logging to ${LOG_FILE}`)
    }
  })
  
}

