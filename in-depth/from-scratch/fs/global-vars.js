console.log({filename: __filename});
console.log({dir: __dirname})

const { join, relative } = require('path')
// a cross-platform path
const A_FILE_NAME = 'water.js'
const crossPlatformPath = join(__dirname, A_FILE_NAME)
console.log('crossPlatformPath')
console.log(crossPlatformPath)

// difference between 2 paths

const PATH_ONE = join(__filename)
const PATH_TWO = join(__dirname,'water/sticks/stones/md.md')

const diff = relative(PATH_ONE, PATH_TWO)
console.log({diff})

