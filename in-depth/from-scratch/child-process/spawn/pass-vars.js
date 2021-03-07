/*
  - a few parts
  - pass an en var to the child process
  - print the env var from the child process
  - pipe the child process stdout to the parent process stdout
- another several steps
  - import the parse part of the path module
  - pull the `root` var out of a parsed process.current working directory
  - spawn a child process that runs the current file (_potentially infinite loop, keep reading tho!_)
  - pass 2 env vars to the spawned process
    - `cwd: root`
    - `env: {IS_CHILD: '1'}`
  - ADJUST THE CURRENT FILE
    - if the env var IS_CHILD is present
      - log a string `child process is ${process.cwd()}`
      - log another string, `env is ${process.env}`
    - when IS_CHILD is not present, do the above process
*/


const { spawn } = require('child_process');
const { parse } = require('path')
console.log('--Start---')


if(process.env.IS_CHILD){
  console.log(`child process is ${process.cwd()}`)
  console.log(`env is`)
  console.log(process.env)
}else{
  console.log('NOT is-child')
  let {root} = parse(process.cwd())
  spawn(process.execPath, [ __filename ],
  {
    env: {
      cwd: root,
      IS_CHILD: 1
    },
    stdio: ['pipe','inherit','inherit']
  })

  console.log('--End---')
}
