const { Transform } = require('stream');

function upperStreamFn(){
  return new Transform({
    transform(chunk,encoding,next){
      const upd = chunk.toString().toUpperCase()
      next(null,upd)
    }
  })
}

console.log('file running')
const upperStream = upperStreamFn()
process.stdin.pipe(upperStream).pipe(process.stdout)
console.log('file ended!')