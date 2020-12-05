const assert = require('assert')
const { join } = require('path')
const fs = require('fs')

const OUTPUT_DIR = 'project'
const OUTPUT_FILE = 'read-then-write.txt';

const project = join(__dirname, OUTPUT_DIR)

try { 
  // remove the file before the process starts
  fs.rmdirSync(project, {recursive: true}) 
} catch (err) {

}

const knownFiles = Array.from(Array(5), () => {  
  return join(project, Math.random().toString(36).slice(2))
})

fs.mkdirSync(project)

for (const f of knownFiles) fs.closeSync(fs.openSync(f, 'w'))
const out = join(__dirname, OUTPUT_FILE)
function exercise () {  
  // TODO read the knownFiles in the project folder  
  // and write them to the out.txt file
}
exercise()
assert(fs.readFileSync(out).toString(), knownFiles.toString())
console.log('passed!')