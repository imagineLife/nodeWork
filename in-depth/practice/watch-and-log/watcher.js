/*
  takes 2 cli params
  --DIR
    the directory to watch, relative to current dir
  --LOG
    the file to post json logs to, relative to current dir
*/ 


// Dependencies
const EventEmitter = require('events');
const { 
  watch, 
  statSync,
  readdirSync 
} = require('fs');
const { join } = require('path');

const { update } = require('./lib/async')

/*
  Setup Event-Manager
*/ 
const Ev = new EventEmitter()

Ev.on('file-created', async function(file){
  knownFiles.add(file)
  update(LOG_FILE, {
    date: new Date(),
    action: 'file-created',
    file
  })
})

Ev.on('file-deleted',function(file){
  knownFiles.delete(file)
  update(LOG_FILE, {
    date: new Date(),
    action: 'file-deleted',
    file
  })
})

console.log({'Event Listeners': Ev.eventNames()})



let args = process.argv

// default vars
let WATCH_DIR = __dirname;
let LOG_FILE = __filename;

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

  // when file is NOT known
  if (knownFiles.has(fileName) === false) {
    e = 'file-created'
    Ev.emit(e,fileName)
  }

  else{
    try{
      console.log('file NOT in og unknown file list')
      // get change-times of the file
      // const { ctimeMs, mtimeMs } = statSync(join(WATCH_DIR, fileName))
      // const stats = statSync(join(WATCH_DIR, fileName))
      // console.log({stats})
    } catch(err){
      // catch DELETED FILES
      if(err.code === 'ENOENT'){
        e = 'file-deleted'
        Ev.emit(e,fileName)
      }
    }
  }
})