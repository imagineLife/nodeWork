/*
  exec && execSync
  execSync
    - returns a buffer, containing the output of the command
    - both stdout && stderr output
*/ 

const { execSync } = require('child_process');

const RUNNABLE_PROCESS = `node -e "console.error('subprocess stdio output')"`
const LIST_FILES = process.platform === 'win32' ? 'dir' : 'ls'

const action = execSync(LIST_FILES) //RUNNABLE_PROCESS

console.log(action.toString())

/*
  Running this will output..
  "subprocess stdio output"
*/ 

