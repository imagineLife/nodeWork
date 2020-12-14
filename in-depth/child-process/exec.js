/*
  exec && execSync
  execSync
    - returns a buffer, containing the output of the command
    - both stdout && stderr output
    - throws error on non-zero exit code, so 
      wrap in a try/catch
*/ 

const { 
  execSync,
  exec
} = require('child_process');

// FIRST COMMAND
/*
  replace the `node` keyword with process.execPath
  - ensures that the subprocess will be
   executing the same version of node of the parent procee

*/
// node version
// const RUNNABLE_PROCESS = `node -e "console.error('subprocess stdio output')"`
// 
// const RUNNABLE_PROCESS = `${process.execPath} -e "console.error('subprocess stdio output')"`
// const LIST_FILES = process.platform === 'win32' ? 'dir' : 'ls'

// const action = execSync(RUNNABLE_PROCESS) //RUNNABLE_PROCESS LIST_FILES

// console.log(action.toString())


/*
  Running the above will output..
  "subprocess stdio output"
*/ 



// SECOND COMMAND, TRY?CATCH ON ERR
/*
  execSync can fail
  - wrap in a try/catch
*/
// try {
//   execSync(`${process.execPath} -e "process.exit(1)"`)
// } catch (err) {
//   console.error('CAUGHT ERROR:', err)
// }


// THIRD COMMAND, CATCHING A THRON ERROR
/*
  tell execSync to throw an err
  - output has a lot...
    - 2 stacks with a gap
      - first stack is fn called inside subprocess
      - 2nd stack is the fns called nin the parent process
*/ 
// try {
//   execSync(`${process.execPath} -e "throw Error('kaboom')"`)
// } catch (err) {
//   console.error('CAUGHT ERROR:', err)
// }





// FOURTH EXAMPLE, exec intor
/*
  exec 
  - takes a string shell command && a callback
  - callback has 3 things
    - err
    - stdout
    - stderr
  

*/
// exec(
//   `${process.execPath} -e "console.log('A');console.error('B')"`, 
//   (err, stdout, stderr) => {
//     console.log('err', err)
//     console.log('subprocess stdout: ', stdout.toString())
//     console.log('subprocess stderr: ', stderr.toString())
//   }
// )

/*
  running above returns
    err null
    subprocess stdout:  A

    subprocess stderr:  B
*/ 



// FIFTH EXAMPLE, ERR IN EXEC
// exec(
//   `${process.execPath} -e "console.log('A'); throw Error('B')"`, 
//   (err, stdout, stderr) => {
//     console.log('err', err)
//     console.log('subprocess stdout: ', stdout.toString())
//     console.log('subprocess stderr: ', stderr.toString())
//   }
// )

/*
  Running above returns
    err Error: Command failed: /usr/local/bin/node -e "console.log('A'); throw Error('B')"
    [eval]:1
    console.log('A'); throw Error('B')
                      ^

    Error: B
        at [eval]:1:25
        at Script.runInThisContext (vm.js:132:18)
        at Object.runInThisContext (vm.js:309:38)
        at internal/process/execution.js:77:19
        at [eval]-wrapper:6:22
        at evalScript (internal/process/execution.js:76:60)
        at internal/main/eval_string.js:23:3

        at ChildProcess.exithandler (child_process.js:308:12)
        at ChildProcess.emit (events.js:315:20)
        at maybeClose (internal/child_process.js:1048:16)
        at Socket.<anonymous> (internal/child_process.js:439:11)
        at Socket.emit (events.js:315:20)
        at Pipe.<anonymous> (net.js:673:12) {
      killed: false,
      code: 1,
      signal: null,
      cmd: `/usr/local/bin/node -e "console.log('A'); throw Error('B')"`
    }
    subprocess stdout:  A

    subprocess stderr:  [eval]:1
    console.log('A'); throw Error('B')
                      ^

    Error: B
        at [eval]:1:25
        at Script.runInThisContext (vm.js:132:18)
        at Object.runInThisContext (vm.js:309:38)
        at internal/process/execution.js:77:19
        at [eval]-wrapper:6:22
        at evalScript (internal/process/execution.js:76:60)
        at internal/main/eval_string.js:23:3

  // Here, the err is not null
  - err.code contains exit code
*/ 









// SIXTH EXAMPLE, no callback, piping
const RUNNABLE_STR = `${process.execPath} -e "console.log('subprocess stdio output')"`
const execRes = exec(RUNNABLE_STR);
function  closeHandler(resStatus){
  console.log(`child onClose, resStatus is ${resStatus}`)
}
console.log(`PARENT LOG, execRes pid is ${execRes.pid}`);
execRes.stdout.pipe(process.stdout)
execRes.on('close', closeHandler)
/*
  Running the above returns 
    PARENT LOG, execRes pid is 4293
    subprocess stdio output
    child onClose, resStatus is 0
*/ 