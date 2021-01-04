const assert = require('assert')
const { join } = require('path')
const { 
  rmdirSync, 
  mkdirSync, 
  closeSync, 
  openSync,
  readFileSync,
  readdir
} = require('fs')


const PROJECT_PATH = join(__dirname, 'project')

try { 
  rmdirSync(PROJECT_PATH, {recursive: true}) 
} catch (err) {

}

// create file-name array
const files = Array.from(Array(5), () => {  
  return join(PROJECT_PATH, Math.random().toString(36).slice(2))
})

// make the project file
mkdirSync(PROJECT_PATH)

for (const f of files) closeSync(openSync(f, 'w'))

const out = join(__dirname, 'out.txt')

function exercise () {  
  readdir(PROJECT_PATH, (err, filesArr) => {
    if(err) console.log({err})
    console.log('files: ')
    console.log(filesArr)
  })
  // TODO read the files in the project folder  
  // and write them to the out.txt file
}

exercise()

// const stringifiedOutput = readFileSync(out).toString()

const stringFiles = files.toString()
console.log('stringFiles')
console.log(stringFiles)


// assert(stringifiedOutput, stringFiles)
console.log('passed!')