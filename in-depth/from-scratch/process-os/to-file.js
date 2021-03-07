/*
  USING THIS
  - try `node -p "4 * 2" | node to-file`
*/ 
console.log(`to-file called, piping!!`)
process.stdin.pipe(process.stdout)