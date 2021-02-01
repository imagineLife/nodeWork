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
console.log(res.stdout.toString())
/*
  should output
  subprocess stdio output
*/