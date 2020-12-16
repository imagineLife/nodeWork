const assert = require('assert');
const { spawn } = require('child_process');

function exercise (myEnvVar) {  
  // TODO return a child process with  
  // a single environment variable set  
  // named MY_ENV_VAR. The MY_ENV_VAR  
  // environment variable's value should  
  // be the value of the myEnvVar parameter  
  // passed to this exercise function

  const { spawn, spawnSync} = require('child_process');
  const FILE_TO_RUN = 'child.js'

  // spawnSync
  // return spawnSync(
  //   process.execPath, 
  //   [FILE_TO_RUN], 
  //   { env: { MY_ENV_VAR: myEnvVar } }
  // )

  // spawn
  return spawn(
    process.execPath, 
    [FILE_TO_RUN], 
    {env: { MY_ENV_VAR: myEnvVar}}
  )
}



module.exports = exercise;