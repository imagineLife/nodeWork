console.log({filename: __filename});
console.log({dir: __dirname})

// a cross-platform path
const A_FILE_NAME = 'water.js'
const crossPlatformPath = require('path').join(__dirname, A_FILE_NAME)
console.log('crossPlatformPath')
console.log(crossPlatformPath)
