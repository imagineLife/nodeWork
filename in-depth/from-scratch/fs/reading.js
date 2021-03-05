const { readFileSync } = require('fs');

const { join } = require('path');
const OTHER_FILE = join(__dirname,`global-vars.js`)

// output to buffer
let fileContent = readFileSync(OTHER_FILE)
