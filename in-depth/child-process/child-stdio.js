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
const DEFAULT_ARR = ['pipe','pipe','pipe']
const INHERIT_ARR = ['pipe','inherit','pipe']
const STREAM_ERR = ['pipe','inherit', process.stdout]
const IGNORE_ERROR = ['pipe', 'inherit', 'ignore']

// PROCESS 1, using explicit default stdio values
const spawnRes = spawn(
  process.execPath,
  [
    NODE_FLAG,
    RUNNABLE_STRING
  ],
  { stdio: DEFAULT_ARR }
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





// PROCESS 2, replacing pipe in array with inherit in 2nd param
// const spawnRes = spawn(
//   process.execPath,
//   [
//     NODE_FLAG,
//     RUNNABLE_STRING
//   ],
//   { stdio: INHERIT_ARR }
// )

// spawnRes.stderr.pipe(process.stdout)
// spawnRes.stdin.write(STRING_INPUT)
// spawnRes.stdin.end()

/*
  Running the above outputs...
    child-process error output
    string input from parent here

  NOTES
  - used INHERIT_ARR
    - using inherit here because inherit, well, inherits the parent stream?!
    - piping child out to parent out
  - SO!
    - BECAUSE the inherit sets the child out to go to parent out...
      - removed the spawnRes.stdout.pipe(process.stdout)
      - the work is done via 'inherit' string
*/ 





// PROCESS 3, using a stream as 3rd param
// const spawnRes = spawn(
//   process.execPath,
//   [
//     NODE_FLAG,
//     RUNNABLE_STRING
//   ],
//   { stdio: STREAM_ERR }
// )

// spawnRes.stdin.write(STRING_INPUT)
// spawnRes.stdin.end()

/*
  Running the above will output
    child-process error output
    string input from parent here
  
  NOTES:
  - passing a direct stream as array value, here in the err position
  - BECAUSE OF THIS REPLACEMENT, 
    the  manually-written spawnRes.stderr.pipe(process.stdout)
      has been removed! as the array arg makes same action happen
      
*/ 







// PROCESS 4, ignoring error output
// const spawnRes = spawn(
//   process.execPath,
//   [
//     NODE_FLAG,
//     RUNNABLE_STRING
//   ],
//   { stdio: IGNORE_ERROR }
// )

// spawnRes.stdin.write(STRING_INPUT)
// spawnRes.stdin.end()

/*
  Running the above outputs
    string input from parent here
  
  NOTE:
  - ignore... ignores the stream, in this case the sterr stream
  - 
*/ 