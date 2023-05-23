import assert from 'assert';
import { EventEmitter } from 'events';

const ee = new EventEmitter();
let count = 0;
const EMIT_INTERVAL_LENGTH = 100
const TEST_INTERVAL_LENGTH = 250;
const EVENT_NAME = 'tick';

setInterval(() => {
  ee.emit(EVENT_NAME);
}, EMIT_INTERVAL_LENGTH);

// function assertOneCount() {
//     assert.equal(count, 1);
//     assert.equal(this, ee);
//     console.log('passed!')
// }
function tickListener() {
  count++;
  setTimeout(() => { 
     assert.equal(count, 1);
    assert.equal(this, ee);
    console.log('passed!')
  }, TEST_INTERVAL_LENGTH);
}

// TODO: register the "tickListener" with the ee
// SO THAT it only logs 1x
ee.once(EVENT_NAME, tickListener)