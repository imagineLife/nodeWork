const { spawnSync } = require('child_process');

const res = spawnSync(process.execPath, ['-e', `console.log('subprocess stdio output')`]);
console.log(res)