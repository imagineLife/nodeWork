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