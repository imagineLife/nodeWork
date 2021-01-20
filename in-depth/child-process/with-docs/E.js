const { exec } = require('child_process');

const RUNNABLE_STRING = "console.log('A'); throw Error('B')"

const CHILD_PROCESS_STR = `${process.execPath} -e "${RUNNABLE_STRING}"`

function childProcessCallback(err,stdout,stderr){
  console.log('err',err)
  console.log('stdout: ',stdout);
  console.log('stderr: ', stderr)
}

exec(CHILD_PROCESS_STR, childProcessCallback)