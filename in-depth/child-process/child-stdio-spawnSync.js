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

/*
  Running the above returns...
    this is a string set in parent
  
  - spawns a child process in sync mode
  - leverages the absolute path to node process
  - leverages -e node flag, evaluate as js
  - passes a child process
    - log an error
    - pipe child input to parent output
  - pass config to child process
    - pass input to child process
      - THIS MUST have the 'pipe' option in the next arr
    - pass stdio arr
      - pipe std input
      - inherit std output
      - ignore std err
*/ 