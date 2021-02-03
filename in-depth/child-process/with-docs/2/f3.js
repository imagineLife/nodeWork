const { spawnSync } = require('child_process');

const RUN_STR = `setTimeout(() => { console.log('done?')}, 1200)`
const res = spawnSync(process.execPath, ['-e', RUN_STR]);
console.log(res.stdout.toString())