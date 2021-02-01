const { spawn } = require('child_process');

const chPro = spawn(
  process.execPath,
  ['-e', `process.exit(1)`]
)

console.log(chPro.pid)
chPro.stdout.pipe(process.stdout);
chPro.on('close', e => console.log('exit status was ',e))