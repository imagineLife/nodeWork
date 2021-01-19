## Child-Process Practice
- run a parent && child process
- set the parent process to wait for the child process to finish (synchronous)
  - A: return a console.log of 'test child string'
  - B: exit with a non-zero exit code from the child-process:
  - C: exit with a thrown error with a string reading 'manually thrown error'
  - 