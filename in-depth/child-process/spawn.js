/*
  spawn && spawnSync
  spawn is different from exec
  - spawn takes executable path as first arg
  - spawn takes 2nd arg as arr
    - flags
    - command
*/ 

// FIRST EXAMPLE, spawnSync
/*
  - '-e' is a flag

*/ 
// const { spawnSync } = require('child_process')
// const RUNNABLE_STRING = `console.log('subprocess stdio output')`

// const result = spawnSync(
//   process.execPath, 
//   ['-e', RUNNABLE_STRING]
// )

// console.log(result)

/*
  Running above output looks like...
  
  {
    status: 0,
    signal: null,
    output: [
      null,
      <Buffer 73 75 62 70 72 6f 63 65 73 73 20 73 74 64 69 6f 20 6f 75 74 70 75 74 0a>,
      <Buffer >
    ],
    pid: 92281,
    stdout: <Buffer 73 75 62 70 72 6f 63 65 73 73 20 73 74 64 69 6f 20 6f 75 74 70 75 74 0a>,
    stderr: <Buffer >
  }

  - spawnSync differs than execSync
    - execSync returns a buffer
    - spawnSync returns an object, of metadata, with buffers in keys
  - 
*/ 

// SECOND EXAMPLE, stringifying output
const { spawnSync } = require('child_process')
const RUNNABLE_STRING = `console.log('subprocess stdio output')`

const result = spawnSync(
  process.execPath, 
  ['-e', RUNNABLE_STRING]
)

console.log(result.stdout.toString())