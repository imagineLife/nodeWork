/*
  takes 2 cli params
  --DIR
    the directory to watch, relative to current dir
  --LOG
    the file to post json logs to, relative to current dir
*/ 

// Dependencies
const { 
  watch, 
  statSync,
  readdirSync 
} = require('fs');
const { join } = require('path');
const { 
  Ev,
  registerEventLoggers
 } = require('./event-setup');

//  helper
function applyArgToCurDir(str){
  let argVal = str.substring(6);
    return `${__dirname}/${argVal}`
}

let args = process.argv

// default vars
let WATCH_DIR = __dirname;
let LOG_FILE = __filename;

// Inpterpret CLI Args
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

// Global State
let knownFiles = new Set(readdirSync(WATCH_DIR))

registerEventLoggers(LOG_FILE, knownFiles);

watch(WATCH_DIR, (e, fileName) => {

  // when file is NOT known
  if (knownFiles.has(fileName) === false) {
    e = 'file-created'
  }
  else{
    e = 'file-deleted'
  }
  Ev.emit(e,fileName)
})