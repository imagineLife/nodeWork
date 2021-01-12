const EventEmitter = require('events');
const { 
  watch, 
  statSync,
  readdirSync 
} = require('fs');
const { join } = require('path');

/*
  Setup Event-Manager
*/ 
const Ev = new EventEmitter()
console.log(`Event-Handler setup`);

Ev.on('file-created',function(f){
  console.log(`file-created`)
  console.log({f})
  knownFiles.add(f)
  console.log({knownFiles})
})

Ev.on('file-deleted',function(f){
  console.log(`file-deleted`)
  console.log({f})
  knownFiles.delete(f)
  console.log({knownFiles})
  
})

console.log({'Event Listeners': Ev.eventNames()})



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

// track the files in the watched dir
let knownFiles = new Set(readdirSync(WATCH_DIR))
console.log({knownFiles})

watch(WATCH_DIR, (e, fileName) => {
  console.log({fileName})

  // when file is NOT known
  if (knownFiles.has(fileName) === false) {
    e = 'file-created'
    Ev.emit(e,fileName)
  }

  else{
    try{
      // get change-times of the file
      // const { ctimeMs, mtimeMs } = statSync(join(WATCH_DIR, fileName))
      const stats = statSync(join(WATCH_DIR, fileName))
      console.log({stats})
    } catch(err){
      // catch DELETED FILES
      if(err.code === 'ENOENT'){
        e = 'file-deleted'
        Ev.emit(e,fileName)
      }
    }
  }
})