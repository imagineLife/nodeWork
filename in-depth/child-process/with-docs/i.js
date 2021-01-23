const { IS_CHILD } = process.env

if(IS_CHILD){
  console.log('Subprocess cwd:', process.cwd())
  console.log('env', process.env)
}else{
  const { spawn } = require('child_process');
  const { parse } = require('path')
  const {root} = parse(process.cwd())
  const res = spawn(
    process.execPath,
    [
     __filename
    ],
    {
      cwd: root,
      env: {
        IS_CHILD: 1
      }
    }
  )
  res.stdout.pipe(process.stdout)
}