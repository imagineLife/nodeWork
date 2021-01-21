const { spawnSync } = require('child_process');
const RUNNABLE_STR = `console.log('subprocess stdio output')`
const RUN_FLAG = '-e'
const res = spawnSync(
  process.execPath,
  [
    RUN_FLAG,
    RUNNABLE_STR
  ]
)
console.log(res)
/*
  Should return...
  {
  status: 0,
  signal: null,
  output: [
    null,
    <Buffer 73 75 62 70 72 6f 63 65 73 73 20 73 74 64 69 6f 20 6f 75 74 70 75 74 0a>,
    <Buffer >
  ],
  pid: 9707,
  stdout: <Buffer 73 75 62 70 72 6f 63 65 73 73 20 73 74 64 69 6f 20 6f 75 74 70 75 74 0a>,
  stderr: <Buffer >
}
*/