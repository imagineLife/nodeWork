const { spawnSync } = require('child_process');

const RUN_STR = `process.exit(1)`
const res = spawnSync(process.execPath, ['-e', RUN_STR]);
console.log(res)