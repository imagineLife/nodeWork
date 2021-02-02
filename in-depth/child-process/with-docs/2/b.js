const { execSync } = require('child_process');

// set the parent process to wait for the child process to finish (synchronous)
// exit with a non-zero exit code from the child-process

const NODE_VAR = process.execPath;
const FLAG = '-e'
const RUN_STR = `process.exit(1)`
const res = execSync(`${NODE_VAR} ${FLAG} "${RUN_STR}"`)
res();