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