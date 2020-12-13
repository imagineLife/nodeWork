/*
  exec && execSync
*/ 

const { execSync } = require('child_process');
const RUNNABLE_PROCESS = `node -e "console.log('subprocess stdio output')"`

const action = execSync(RUNNABLE_PROCESS)

console.log(action.toString())

/*
  Running this will output..
  "subprocess stdio output"
*/ 

