const { spawn } = require('child_process');

const RUN_VAR = process.execPath
const FLAG = '-e'
const RUN_STR = `console.log('starting');
setTimeout(() => { console.log(25); }, 1200);
console.log('ending')`
const s = spawn(RUN_VAR, [
  FLAG,
  RUN_STR
])

s.stdout.on('data',d => console.log(` stdout d: ${d}`))
s.stdout.on('message',d => console.log(` stdout m: ${d}`))
s.on('data',d => console.log(`d: ${d}`))
s.on('message',d => console.log(`m: ${d}`))