const EventEmitter = require('events');

const Ev = new EventEmitter()
console.log(`Event-Emitter created`);

let args = process.argv

// default vars
let WATCH_DIR = __dirname;
let LOG_FILE = __filename;
// console.log({LOG_FILE})
// console.log({WATCH_DIR})


