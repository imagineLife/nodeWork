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
const STRING_INPUT = 'string input from parent here\n'
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
spawnRes.stdin.write(STRING_INPUT)
spawnRes.stdin.end()

/*
  NOTES
  
  running the above returns...
    child-process error output
    parent input string
  
  RUNNABLE_STRING
    - logs an error
    - intended to pipe child process stdin to the child stdout
  
  NOTICE the options object
    - stdio as arr of 3 strings, pipe
    - THIS IS 'DEFAULT' BEHAVIOR, set explicitly here
    - pipe means to expose a stream for each of 3 stdio devices
    - each element 'corresponds with the file-descriptors'
      - first element sets child-process STDIN
      - second element sets child-process STDOUT
      - third element sets child-process STDERR
  
  PROCESS OVERVIEW
  - build a few vars, including runnable-string (see above)
  - spawn a child process
    - using node binary (process.execPath)
    - passing -e evaluate flag
    - passing runnable string as executable line to spawn process
      - this pipes the child-process stdin to the stdout
    - passes the config object (see above)
  - piping...
    - pipe child out to parent out
    - pipe child err to parent out
  - writing...
    - write to child input stream
  - exit the child
    - triggers the parent to exit

*/ 