const { spawn } = require('child_process');

const PROCESS = process.execPath
const FLAGS = '-e'
const DO = `console.log(process.env)`
const chPro = spawn(PROCESS, [
  FLAGS,
  DO
],
{
  env: {
    "DEMO_VAR": "WATER"
  }
})

chPro.stdout.pipe(process.stdout);
// chPro.on('close', exitStatusCode => console.log(`exit status was ${exitStatusCode}`))