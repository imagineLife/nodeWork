## Node Topics

[CLI && Binary](#cli-&&-binary)  
[Debugging](#debugging)

### CLI && Binary

- run flags
  - `-e`: evaluate
  - `-p`: evaluate && print
  - `-r`: require, "pre-load" a module

## Debugging

- inspect && break on first line
  - `node --inspect-brk file-to-run.js`
  - open `chrone://inspect`
- break on an error
  - use the checkbox in chrome inspect view `pause on caught exceptions`
- add breakpoints to a node process
  - in the code
    - add a `debugger` keyword where the breakpoint will be leveraged
  - in the inspector
    - add a blue 'flag' to the line number that the breakpoint will be leveraged
