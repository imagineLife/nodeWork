const { readFile } = require('fs')
const FILE_TO_READ = './demo-file.txt'

function smallLoop(){
  for(let x = 1; x < 6; x++){
    console.log(`looping index ${x}`)
  }
}
console.log('---START---')
readFile(FILE_TO_READ, (err, fileRes) => {
  console.log('fileRes')
  console.log(fileRes)
})
console.log('after readFile, bout to call smallLoop')
smallLoop()
console.log('---END---')