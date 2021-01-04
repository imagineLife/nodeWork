const assert = require('assert')
const { join } = require('path')
const fs = require('fs')

const project = join(__dirname, 'project')

try { 
  fs.rmdirSync(project, {recursive: true}) 
} catch (err) {

}

const files = Array.from(Array(5), () => {  
  return join(project, Math.random().toString(36).slice(2))
})

fs.mkdirSync(project)
for (const f of files) fs.closeSync(fs.openSync(f, 'w'))

const out = join(__dirname, 'out.txt')

function exercise () {  
  // TODO read the files in the project folder  
  // and write them to the out.txt file
}

exercise()

assert(fs.readFileSync(out).toString(), files.toString())
console.log('passed!')