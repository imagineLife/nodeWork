import { once, EventEmitter } from 'events';
import { setTimeout } from 'timers/promises';

const sometimesLaggy = new EventEmitter();

const ac = new AbortController();
const { signal } = ac;

const TIMEOUT_TIME = 2000 * Math.random();
console.log('TIMEOUT_TIME')
console.log(TIMEOUT_TIME)

setTimeout(TIMEOUT_TIME, null, { signal }).then(() => {
  console.log('laggy then, emitting ping')
  sometimesLaggy.emit('ping');
});

setTimeout(500).then(() => { 
  console.log('500 then, aborting!')
  ac.abort();
});

try {
  console.log('1')
  
  await once(sometimesLaggy, 'ping', { signal });
  console.log('2');
} catch (err) {
  console.log('CATCH 3');
  console.log('err.code: ', err.code);
  
  // ignore abort errors:
  if (err.code !== 'ABORT_ERR') throw err;
  console.log('CATCH 4');
}
