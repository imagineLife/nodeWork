// Dependencies
const { createGzip } = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util')
const {
  createReadStream,
  createWriteStream
} = require('fs');

const promisePipe = promisify(pipeline);

// helper
//  helper
function applyArgToCurDir(str, strPlit){
  let argVal = str.substring(strPlit);
    return `${__dirname}/${argVal}`
}

// Process Vars from cli
if(process.argv.length < 3) {
  console.log(`Use 2 CLI flags: --INPUT=<file-name> and --OUTPUT=<file-name.gz>`)
  process.exit()
}
let INPUT = ''
let OUTPUT = ''
process.argv.forEach((arg, argIdx) => {
  if(argIdx < 2) return;
  if(arg.includes('--INPUT')) {
    INPUT = applyArgToCurDir(arg,8)
  }
  if(arg.includes('--OUTPUT')) {
    OUTPUT = applyArgToCurDir(arg,9)
  }
})

if(INPUT.length < 1){
  console.log(`Include CLI flag --INPUT=<file-name>`)
  process.exit()
}

if(OUTPUT.length < 1){
  console.log(`Include CLI flag --OUTPUT=<file-name>`)
  process.exit()
}

// Init Streams
const gzip = createGzip();
const source = createReadStream(INPUT);
const destination = createWriteStream(OUTPUT);

async function run() {
  await promisePipe(
    source,
    gzip,
    destination
  );
  console.log('Pipeline succeeded.');
}


try{
  run()  
}catch(e){
  console.error(e)
}