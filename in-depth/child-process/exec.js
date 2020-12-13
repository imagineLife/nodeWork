/*
  exec && execSync
  execSync
    - returns a buffer, containing the output of the command
    - both stdout && stderr output
*/ 

const { execSync } = require('child_process');
const RUNNABLE_PROCESS = `node -e "console.error('subprocess stdio output')"`

const action = execSync(RUNNABLE_PROCESS)

console.log(action.toString())

/*
  Running this will output..
  "subprocess stdio output"
*/ 

