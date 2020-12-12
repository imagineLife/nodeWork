console.log('initialized');
console.log(process.stdin.isTTY ? 'terminal\n' : 'piped to\n');

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
  interesting ways to use this!
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
  node - "crypto.randomBytes(100).toString('hex')" | node pipe-to-uppercase.js > output.txt
    - redirects to a file
    - the ">" sends output to a file
  node - "crypto.randomBytes(100).toString('hex')" | node pipe-to-uppercase.js > output.txt 2< another.txt
    - directs stdout to the first file && stderr to the 2> file
    
*/ 