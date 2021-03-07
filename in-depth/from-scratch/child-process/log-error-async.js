const { exec } = require('child_process');

exec(`${process.execPath} -e "console.log('A');console.error('B');"`, (err,stdout,stderr) => {
  if(err){
    console.log('e')
    console.log(err)
    return;
  }

  if(stdout){
    console.log('stdout')
    console.log(stdout)
  }

  if(stderr){
    console.log('stderr')
    console.log(stderr)
  }
})
