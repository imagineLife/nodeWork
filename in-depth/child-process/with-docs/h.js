const { spawn } = require('child_process');
const res = spawn(
  process.execPath, 
  [
    '-p',
    'process.env'
  ],
  {
    env: {
      "DEMO_VAR":'WATER'
    }
  }
)

res.stdout.pipe(process.stdout)