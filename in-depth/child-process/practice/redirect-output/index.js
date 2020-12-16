const { spawn } = require('child_process')
const CUSTOM_ARR = ['ignore', 'inherit', 'pipe']
const [ node ] = process.argv
function exercise (command, args) {  
  return spawn(command, args, { stdio: CUSTOM_ARR })
}

module.exports = exercise