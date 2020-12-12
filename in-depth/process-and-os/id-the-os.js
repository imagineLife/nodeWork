const { platform }= require('os')

/*
  GOAL
  - output the os
  - run node `test-os-log-output` and 'pass'
*/
console.log(platform())
process.exit(1)