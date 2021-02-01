const { spawn } = require('child_process');

const chPro = spawn(
  process.execPath,
  ['-e', `console.log('subprocess stdio output')`]
)
console.log(`pid is ${chPro.pid}`)

chPro.stdout.pipe(process.stdout)

chPro.on('close', exitStatusCode => console.log(`exit status was ${exitStatusCode}`))