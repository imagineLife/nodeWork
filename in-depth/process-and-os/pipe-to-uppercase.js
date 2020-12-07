console.log('initialized');
const { Transform } = require('stream');
const createTransStream = () => {
  return new Transform({
    transform(chunk,enc,next){
      const upd = chunk.toString().toUpperCase()
      next(null,upd);
    }
  })
}

const ucStream = createTransStream()
process.stdin
  .pipe(ucStream)
  .pipe(process.stdout)