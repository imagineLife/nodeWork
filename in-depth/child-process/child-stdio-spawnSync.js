const { spawnSync } = require('child_process');
const NODE_FLAG = '-e';
const RUNNABLE_PROCESS_STR = `console.error('err string output'); process.stdin.pipe(process.stdout)`;
const STRING = `this is a string set in parent\n`;
const IO_ARR = ['pipe', 'inherit', 'ignore'];

// Sending input to spawnSync
spawnSync(
  process.execPath,
  [
    NODE_FLAG,
    RUNNABLE_PROCESS_STR
  ],
  {
    input: STRING,
    stdio: IO_ARR
  }
)