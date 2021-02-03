const { exec } = require('child_process');

exec(`${process.execPath} -e "console.log('A'); throw Error('B');"`, (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
})