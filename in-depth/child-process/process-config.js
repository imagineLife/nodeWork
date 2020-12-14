/*
  2 options in scope here,
  cwd
  env
*/ 


// EXAMPLE 1, logging parent process.env
const { spawn } = require('child_process')

// process.env.THIS_VAR = 'TEST VAL'
// const NODE_FLAG = '-p'
// const RUNNABLE_CMD_STR = `process.env`
// const spawnRes = spawn(process.execPath, [
//   NODE_FLAG,
//   RUNNABLE_CMD_STR
// ])
// spawnRes.stdout.pipe(process.stdout)

/*
  Running the above outputs the entrie process.env object,
  including the THIS_VAR that was set as a key/value pair
*/





// EXAMPLE 2, logging child-only process.env
// process.env.THIS_VAR = 'TEST VAL'
// const NODE_FLAG = '-p'
// const RUNNABLE_CMD_STR = `process.env`
// const spawnRes = spawn(process.execPath, [
//   NODE_FLAG,
//   RUNNABLE_CMD_STR
// ],
// {
//   env: {
//     SUBPROCESS_VAR: 'subprocess value here'
//   }
// })
// spawnRes.stdout.pipe(process.stdout)

/*
  Running the above outputs...
  {
    SUBPROCESS_VAR: 'subprocess value here',
    __CF_USER_TEXT_ENCODING: '0x1F5:0x0:0x0'
  }

  NOTE: only the subprocess env object,
   passed as 3rdd param in spawn, gets logged

*/ 






// THIRD EXAMPLE, creating child && logging var
const { IS_CHILD } = process.env

if (IS_CHILD) {
  console.log('IS CHILD - Subprocess cwd:', process.cwd())
  console.log('env', process.env)
} else {
  console.log('PARENT cwd:', process.cwd())
  const { parse } = require('path')
  const { root } = parse(process.cwd())
  const { spawn } = require('child_process')
  const spawnRes = spawn(process.execPath, [__filename], {
    cwd: root,
    env: {IS_CHILD: '1'}
  })

  spawnRes.stdout.pipe(process.stdout)
}
/*
  ABOVE outputs....
    PARENT cwd: /path/to/current/file/via/absolute/path
    IS CHILD - Subprocess cwd: /
    env { IS_CHILD: '1', __CF_USER_TEXT_ENCODING: '0x1F5:0x0:0x0' }

  JS PROCESS OVERVIEW
  - goes to else
   - imports parse
   - imports root
   - imports spawn
   - spawns a process
    - using root node
    - in the current-file via '__filename'
    - passes config obj
      - IS_CHILD set to 1
      - cwd is set to.... the current working directory
        from parse(process.cwd())
      

*/
