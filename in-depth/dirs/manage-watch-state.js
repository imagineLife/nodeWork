const { join, resolve } = require('path')
const { watch, readdirSync, statSync } = require('fs')

const PATH_TO_WATCH = '.'
const cwd = resolve(PATH_TO_WATCH)

const knownFiles = new Set(readdirSync(PATH_TO_WATCH))

watch(PATH_TO_WATCH, (evt, filename) => {
  try { 
    
    // get change-times of the file
    const { ctimeMs, mtimeMs } = statSync(join(cwd, filename))

    // when file is known
    if (knownFiles.has(filename) === false) {
      evt = 'created'
      knownFiles.add(filename)

    // when file is not known
    } else {
      if (ctimeMs === mtimeMs) evt = 'content-updated'
      else evt = 'status-updated'
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      knownFiles.delete(filename)
      evt = 'deleted'
    } else {
      console.error(err)
    }
  } finally {
    console.log(evt, filename)
  }
})

/*
  Try these commands, see some more fitting logs than the `watching.js`
  - node -e "fs.writeFileSync('test', 'test')"
    - create new file called 'test' with text 'test'
    - creates event "created"
  - node -e "fs.mkdirSync('test-dir')"
    - creates folder test-dir
    - creates event "created"
  - node -e "fs.chmodSync('test-dir', 0o644)"
    - sets permissions on dir
    - creates event "status-updated"
  - node -e "fs.writeFileSync('test', 'test')"
    - write same content to previously created file
    - creates event "content-updated" 
  - (node -e "fs.chmodSync('test-dir', 0o644)"
    - set permissions on test-dir (again)
    - creates event "status-updated"
  - node -e "fs.unlinkSync('test')"
    - deletes file
    - creates event "deleted"
*/ 