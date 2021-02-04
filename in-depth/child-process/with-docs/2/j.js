const { spawn } = require('child_process');

const P = process.execPath
const FLAG = `-e`
const chPro = spawn(P, [
  FLAG,
  `console.error('error output'); process.stdin.pipe(process.stdout);`
],
{
  stdio: ['pipe','inherit',process.stdout]
})

chPro.stdin.write('this input from parent will become output\n');
chPro.stdin.end()