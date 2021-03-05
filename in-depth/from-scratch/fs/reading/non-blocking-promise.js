const { readFile } = require('fs/promises')
const FILE_TO_READ = './demo-file.txt'

function smallLoop(){
  for(let x = 1; x < 6; x++){
    console.log(`looping index ${x}`)
  }
}
async function readIt(){
  let fileRes = await readFile(FILE_TO_READ)
  console.log('fileRes')
  console.log(fileRes)
}
console.log('---START---')
readIt()
console.log('after readFile, bout to call smallLoop')
smallLoop()
console.log('---END---')