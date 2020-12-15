/*
  Altering the default stream output of exec && spawn
  exec && span both return a ChildProcess instance,
   which include default streams of stin, stdout && stderr
   HERE
   those get altered
*/ 

const { spawn } = require('child_process');
const NODE_FLAG = `-e`
const RUNNABLE_STRING = `console.error('child-process error output');process.stdin.pipe(process.stdout)`;
const PARENT_STRING_INPUT = 'parent input string\n'
const spawnRes = spawn(
  process.execPath,
  [
    NODE_FLAG,
    RUNNABLE_STRING
  ],
  { stdio: ['pipe','pipe','pipe'] }
)

spawnRes.stdout.pipe(process.stdout)
spawnRes.stderr.pipe(process.stdout)
spawnRes.stdin.write(PARENT_STRING_INPUT)
spawnRes.stdin.end()

/*
  NOTES
  
  running the above returns...
    child-process error output
    parent input string
  
  
*/ 