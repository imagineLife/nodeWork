// pull from env var
const { IS_CHILD } = process.env

const cwd = process.cwd()
// when run from child process
if(IS_CHILD){
  console.log('Subprocess cwd:', process.cwd())
  console.log('env', process.env)
}

else{
  const { spawn } = require('child_process')
  const { parse } = require('path')
  const {root} = parse(process.cwd())
  
  
  const x = spawn(process.execPath, [__filename],{
    cwd: root,
    env: {
      IS_CHILD: 1
    }
  })
  x.stdout.pipe(process.stdout)
}