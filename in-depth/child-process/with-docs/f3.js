const { spawnSync } = require('child_process');
const RUNNABLE_STR = `process.exit(1)`
const RUN_FLAG = '-e'
const res = spawnSync(
  process.execPath,
  [
    RUN_FLAG,
    RUNNABLE_STR
  ]
)
console.log(res)