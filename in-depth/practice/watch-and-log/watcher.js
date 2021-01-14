/*
  takes 2 cli params
  --DIR
    the directory to watch, relative to current dir
  --LOG
    the file to post json logs to, relative to current dir


  File Overview
  - import dependencies
  - create a 'helper fn'
  - interpret CLI args
  - build global state of existing file names in watched-directory
  - register event handlers
  - watch the directory
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
 const { c } = require('./helpers')


//  helper
function applyArgToCurDir(str){
  let argVal = str.substring(6);
    return `${__dirname}/${argVal}`
}

// Interpret CLI Args
let args = process.argv
let WATCH_DIR = __dirname;
let LOG_FILE = __filename;

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
  console.log(c.green, c.black,'CLI Ars are Processed', c.reset);
}

// Global State
let existingFileNames = new Set(readdirSync(WATCH_DIR))

registerEventLoggers(LOG_FILE, existingFileNames);

watch(WATCH_DIR, (e, fileName) => {

  // when file is NOT known
  if (existingFileNames.has(fileName) === false) {
    e = 'file-created'
  }
  else{
    e = 'file-deleted'
  }
  Ev.emit(e,fileName)
})