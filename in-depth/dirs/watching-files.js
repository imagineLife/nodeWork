'use strict'
const assert = require('assert')
const { join } = require('path')
const fs = require('fs')
const { promisify } = require('util')
const timeout = promisify(setTimeout)
const project = join(__dirname, 'project')
try { fs.rmdirSync(project, {recursive: true}) } catch (err) {
  console.error(err)
}
fs.mkdirSync(project)

let answer = ''

function makeRandomString(){
  return Math.random().toString(36).slice(2)
}
async function writer () {
  const { open, chmod, mkdir } = fs.promises

  // make && create random-named file in 'project' dir
  const firstFile = join(project, makeRandomString())
  const handle = await open(firstFile, 'w')
  await handle.close()

  // wait
  await timeout(500)

  // perform custom logic, below
  exercise(project)

  // Create a file, a dir, && change permissions of first file
  const file = join(project, makeRandomString())
  const dir = join(project, makeRandomString())
  const add = await open(file, 'w')
  await add.close()
  await mkdir(dir)
  await chmod(firstFile, 0o644)

  // wait
  await timeout(500)
  
  // assert
  assert.strictEqual(
    answer, 
    file, 
    'answer should be the file (not folder) which was added'
  )
  console.log('passed!')
  process.exit()
}

writer().catch((err) => {
  console.error(err)
  process.exit(1)
})


function exercise (project) {
  const files = new Set(fs.readdirSync(project))

  fs.watch(project, (evt, filename) => {
    
    try { 
      const filepath = join(project, filename)
      const stat = fs.statSync(filepath)
      /*
        TODO - only set the answer variable if the filepath is...
        - not a dir
        - not an updated existing file (not the chmod call)
      */ 
      if(!stat.isDirectory()){
        if(stat.ctimeMs == stat.birthtimeMs){
          answer = filepath
        }
      }
    } catch (err) {

    } 
  })
}