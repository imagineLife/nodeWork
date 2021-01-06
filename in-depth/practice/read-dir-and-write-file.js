const assert = require('assert')
const { join } = require('path')
const { 
  rmdirSync, 
  mkdirSync, 
  closeSync, 
  openSync,
  readFileSync,
  readdir,
  writeFile,
  promises
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

// read the files
// write the filenames to the out.txt file (the 'out' var)

// Callbacks
// function readAndWrite () {  
//   readdir(PROJECT_PATH, (err, filesArr) => {
//     if(err) console.log({err})
//     writeFile(out, filesArr.toString(), {flag: 'a'}, (err) => {
//       if (err) throw err;
//     });
//   })
// }

// async
async function readAndWrite () {  
  try{
    const filesArr = await promises.readdir(PROJECT_PATH)//, (err, filesArr) => {
    const x = await promises.writeFile(out, filesArr.toString(), {flag: 'a'})
    const stringifiedOutput = readFileSync(out).toString()
    const stringFiles = files.toString()

    assert(stringifiedOutput, stringFiles)
    console.log('passed!')
  }catch(e){
    console.log({e})
  }
}


readAndWrite()

// const stringifiedOutput = readFileSync(out).toString()
// const stringFiles = files.toString()

// assert(stringifiedOutput, stringFiles)
// console.log('passed!')