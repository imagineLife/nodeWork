## Child-Process Practice

### Using exec && execSync
- run a parent && child process
- set the parent process to wait for the child process to finish (synchronous)
  - A: return a console.log of 'test child string'
  - B: exit with a non-zero exit code from the child-process:
  - C: throw an error with a string reading 'manually thrown error', and catch the error gracefully
- set the child-process method to work with a callback, asynchronously
  - D: set the child process to...
    - log a string of 'A'
    - log an error to the console of a string of 'B'
  - E: set the child process to...
    - log a string of 'A'
    - throw and error with string of 'B'

### Using spawn && spawnSync
- F: output the entire result set of a spawnSunc process, evaluating a console.log(`subprocess stdio output`)
- F2: output a stringified result
- F3: instead of outputting the above console.log, return non-zero exit to the process ( `process.exit(1)` ). Output the entire result of the child process
- G: leverage spawn to...
  - return a childProcess && assign it to a var `chPro`
  - set the childProcess to log a string 'subprocess stdio output'
  - from the parent, log a string that logs the childProcess pid, using `pid is ${chPro.pid}`
  - pipe the childProcess stdout to the parent process stdout
  - set the onClose event listener to log a string with the exist status - `exit status was ${exitStatusCode}`
  - should return...
    - pid is 26868
    - subprocess stdio output
    - exit status was 0
- G2:
  - return a childProcess in var `chPro`
  - from the parent, log a string that logs the childProcess pid, using `pid is ${chPro.pid}`
  - pipe the childProcess stdout to the parent process stdout
  - set the onClose event listener to log a string with the exist status - `exit status was ${exitStatusCode}`