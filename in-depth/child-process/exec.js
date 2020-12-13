/*
  exec && execSync
  execSync
    - returns a buffer, containing the output of the command
    - both stdout && stderr output
    - throws error on non-zero exit code, so 
      wrap in a try/catch
*/ 

const { execSync } = require('child_process');

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
  texx execSync to throw an err
*/ 
// try {
//   execSync(`${process.execPath} -e "throw Error('kaboom')"`)
// } catch (err) {
//   console.error('CAUGHT ERROR:', err)
// }





// FOURTH EXAMPLE, ERRORS IN DEPTH
/*
  Errors are caught in err.stderr and err.output[2]


*/