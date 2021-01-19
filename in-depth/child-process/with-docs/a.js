const {execSync} = require('child_process');
const LOG_STRING = "test child string"
const RUNNABLE_STR_PROCESS = `console.log('${LOG_STRING}')`

const res = execSync(`${process.execPath} -e "${RUNNABLE_STR_PROCESS}"`)
console.log(res.toString())