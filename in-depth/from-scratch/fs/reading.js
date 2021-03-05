const { readFileSync } = require('fs');

const { join } = require('path');
const OTHER_FILE = join(__dirname,`global-vars.js`)

// output to buffer
// let fileContent = readFileSync(OTHER_FILE)

// to string v1
// const STRING_VERSION = fileContent.toString()

// to String v2
let fileContent = readFileSync(OTHER_FILE, { encoding: 'utf8'});
const STRING_VERSION = fileContent
console.log('STRING_VERSION')
console.log(STRING_VERSION)
