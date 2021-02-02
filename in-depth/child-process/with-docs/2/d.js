const { exec } = require('child_process');

const res = exec(`${process.execPath} -e "console.log('A'); console.error('B');"`, (e, stdout,stderr) => {
  console.log(stdout)
  console.log(stderr)
})