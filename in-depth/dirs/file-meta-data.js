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
  const typeLabel = typeFromStat(stat)
  console.log(typeLabel, name)
}