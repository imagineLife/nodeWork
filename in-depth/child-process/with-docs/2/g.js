const { spawn } = require('child_process');

const PROCESS = process.execPath
const FLAGS = '-e'
const DO = `console.log('stdio output')`
const chPro = spawn(PROCESS, [
  FLAGS,
  DO
])

console.log(`pid is ${chPro.pid}`)

chPro.stdout.pipe(process.stdout);
chPro.on('close', exitStatusCode => console.log(`exit status was ${exitStatusCode}`))