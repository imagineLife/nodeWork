console.log('initialized');
console.log(process.stdin.isTTY ? 'terminal' : 'piped to');

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


/*
  2 interesting ways to use this!
  - run 
  node - "crypto.randomBytes(100).toString('hex')" | node pipe-to-uppercase.js
    - this will...
      - run the randomBytes str
      - pipe the res to this file
      - output the uppercase version to stdout
  node pipe-to-uppercase
    - this will...
      - start a node server
      - allow text input in the cmd line
      - convert any text input in cmd line to UPPERCASE
*/ 