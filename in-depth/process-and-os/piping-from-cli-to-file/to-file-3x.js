/*
  run with 
  node -p "crypto.randomBytes(25).toString('hex')" | node to-file-3x.js > out.txt 2> err.txt
  will...
  - create random hex'd crypto string
  - pipe string to the `to-file-3x` node process
  - pipe output to out.txt
  - pipe err output to err.txt
*/ 

const { Transform } = require('stream')

function makeUpperStream(){
  return new Transform({
    transform(chunk,enc,nxt){
      const ucStr = chunk.toString().toUpperCase()
      nxt(null,ucStr)
    }
  })
}

process.stderr.write(process.stdin.isTTY ? 'from terminal\n' : 'piped to\n')

const ucs = makeUpperStream()

process.stdin.pipe(ucs).pipe(process.stdout)