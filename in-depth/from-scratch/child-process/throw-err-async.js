const { exec } = require('child_process');
console.log('BEFORE')

exec(`${process.execPath} -e "console.log('A'); throw Error('B');"`, (err,stdout,stderr) => {
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
setTimeout(() => {
  console.log('AFTER')
}, 500)