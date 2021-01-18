// Dependencies
const assert = require('assert')
const { join } = require('path')
const fs = require('fs')
const { promisify } = require('util')

// Vars
const promiseTimeout = promisify(setTimeout)
const DIR_TO_WATCH = join(__dirname, 'dir-to-watch')
const TIME_DURATION = 500

try { 
  fs.rmdirSync(DIR_TO_WATCH, {recursive: true}) 
} catch (err) {
  console.error(err)
}

fs.mkdirSync(DIR_TO_WATCH)

let answer = ''

function watchAndDo (DIR_TO_WATCH) {

  // read files from DIR_TO_WATCH dir
  const files = new Set(fs.readdirSync(DIR_TO_WATCH))
  
  // Watch the DIR_TO_WATCH
  fs.watch(DIR_TO_WATCH, (evt, filename) => {
    try {
      const filepath = join(DIR_TO_WATCH, filename)
      const stat = fs.statSync(filepath)

      // only set var when NOT a directory
      if(!stat.isDirectory()){
        // only set var on newly-created files
        if(stat.birthtimeMs == stat.ctimeMs){
          answer = filepath      
        }
      }
      
    } catch (err) {    }  
  })
}

async function runIt () {  
  const { open, chmod, mkdir } = fs.promises  

  // build var + create pre file
  const pre = join(DIR_TO_WATCH, Math.random().toString(36).slice(2))  
  const handle = await open(pre, 'w')  
  await handle.close()  
  
  // manual timer
  await promiseTimeout(TIME_DURATION)  


  watchAndDo(DIR_TO_WATCH)  


  /*
    Perform logic on the DIR_TO_WATCH directory
    - create funky filke names
    - add a file
    - make a directory
    - change permissions on a file
  */ 
  const file = join(DIR_TO_WATCH, Math.random().toString(36).slice(2))
  const dir = join(DIR_TO_WATCH, Math.random().toString(36).slice(2))  
  
  // create file
  const add = await open(file, 'w')
  await add.close()

  // make a directory
  await mkdir(dir)
  
  // change permissions of the 'pre' file
  await chmod(pre, 0o644)

  await promiseTimeout(TIME_DURATION)

  assert.strictEqual(
    answer,
    file,
    'answer should be the file (not folder) which was added'  
  )  
  console.log('passed!')
  process.exit()
}

runIt().catch((err) => {  
  console.error(err)  
  process.exit(1)
})


