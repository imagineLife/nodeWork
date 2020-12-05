/*
  file metadata methods
  
  fs.stat
  fs.statSync
  fs.promises.stat
  fs.lstat
  fs.lstat
  fs.lstatSync
  fs.proomises.lstat
*/ 

const { readdirSync, statSync } = require('fs')

const files = readdirSync('.')
const typeFromStat = stat => stat.isDirectory() ? 'dir: ' : 'file: ';
for (const name of files) { 
  
  const stat = statSync(name)
  const { atime, birthtime, ctime, mtime } = stat
  const typeLabel = typeFromStat(stat)
  console.group(typeLabel, name)
  console.log(`aTime: ${atime}`)
  console.log('atime:', atime.toLocaleString())
  console.log('ctime:', ctime.toLocaleString())
  console.log('mtime:', mtime.toLocaleString())
  console.log('birthtime:', birthtime.toLocaleString())
  console.groupEnd()
  console.log()
}