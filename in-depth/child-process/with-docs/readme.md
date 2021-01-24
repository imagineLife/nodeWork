## Child-Process Practice

### Using exec && execSync

- run a parent && child process
- set the parent process to wait for the child process to finish (synchronous)
  - A: set child to evaluate a console.log of 'test child string'
  - B: exit with a non-zero exit code from the child-process
  - C: set child to evaluate an error being thrown with a string reading 'manually thrown error', and catch the error gracefully in the parent
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
- H:
  - spawn a child process
  - set the chilProcess to print the results of the process.env value
  - pass an env var to the child process `DEMO_VAR=WATER`
  - pipe the childProcess stdout to the parent process stdout
- I:
  - create a file that...
    - pulls a var from process.env = IS_CHILD
    - if IS_CHILD
      - log the subprocess cwd
      - log the env
    - else
      - spawn a child Process that runs the current file
      - pass 2 vars to the obj
        - root to the cwd
        - is_child = 1 to the env
      - pip the child-process stdout to process.stdout
- J:
  - spawn a child process
  - evaluate a script that returns a string of 2 things:
    - a console.error message of 'err output'
    - a pipe of the process.stdin to the process.stdout
  - levearage the spawn options object to...
    - inherit the stdout of the parent process
    - pipe the childProcess stderr to the parent process stdout
  - write to the childProcess stdin 'this input from parent will become output\n'
  - end the childProcess stdin
- J2:
  - repeat the above ACCEPT...
    - leverage a synchronous method of spawning a child process
    - include in the options a 'write' to the input of the stream 'this input from parent will become output\n'