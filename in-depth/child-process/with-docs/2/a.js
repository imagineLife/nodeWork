const { execSync } = require('child_process');

const NODE_VAR = process.execPath
const FLAG = '-e'
const RUN_STR = "console.log('test child string')"
const res = execSync(`${NODE_VAR} ${FLAG} "${RUN_STR}"`)
console.log(res.toString())