/*
  USING THIS
  - try `node -p "4 * 2" | node to-file`
  - includes detecting wether the process is called directly from cli or from a piped process
*/ 
console.log(`to-file called, piping!!`)
console.log(process.stdin.isTTY ? 'from terminal' : 'piped to')
process.stdin.pipe(process.stdout)