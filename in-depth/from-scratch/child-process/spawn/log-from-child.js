/*
  - spawn a child process that exits with a non-zero exit code
  - pipe the sub-process stdout to the parent process stdout 
    && log a string in the subprocess stdout 
    (_the log should appear in the parent process stdout_)
*/ 

const { spawnSync } = require('child_process');

// first bullet
// console.log('--start--')
// const chPro = spawnSync(process.execPath, [
//   '-e',
//   'process.exit(1)'
// ])
// console.log('chPro')
// console.log(chPro)

// console.log('--end--')





/* Second Bullt
  - pipe the sub-process stdout to the parent process stdout 
    && log a string in the subprocess stdout 
    (_the log should appear in the parent process stdout_)
*/
console.log('--start--')
const chPro = spawnSync(process.execPath, [
  '-e',
  'console.log("child string here")'
],
{
  stdio:['pipe','inherit','inherit']
});

console.log('--end--')
