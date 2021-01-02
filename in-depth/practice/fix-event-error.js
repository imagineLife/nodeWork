const { EventEmitter } = require('events')

process.nextTick(console.log, 'passed!')

const ee = new EventEmitter()

/*
  WITHOUT listening for the 'error' event, the next line,
   the error will throw.
  WITH the like below, the error will NOT throw
*/ 
ee.on('error', (e) => {
  
})

ee.emit('error', Error('timeout'))