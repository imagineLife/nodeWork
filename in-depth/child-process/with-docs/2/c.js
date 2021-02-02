const { execSync } = require('child_process');

const NODE_VAR = process.execPath
const FLAGS = `-e`
const RUN_STR = `throw Error('manually thrown error')`
const PROCESS_STR = `${NODE_VAR} ${FLAGS} "${RUN_STR}"`
const res = execSync(PROCESS_STR)

console.log(res.toString())