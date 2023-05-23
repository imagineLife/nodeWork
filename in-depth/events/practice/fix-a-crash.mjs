import { EventEmitter } from 'events';

const ERROR_EVENT = 'error';
process.nextTick(console.log, 'should log!!');
const ee = new EventEmitter();


// add something here to STOP from crashing!
// this is the "solution" code block
function errorLogger(e) {
  console.log(e?.message)
}
ee.on(ERROR_EVENT, errorLogger)


// this is to force an error
ee.emit(ERROR_EVENT, Error('forced error here'))