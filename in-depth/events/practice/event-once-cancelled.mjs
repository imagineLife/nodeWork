import { once, EventEmitter } from 'events';
import { setTimeout } from 'timers/promises';

const uneventful = new EventEmitter();
const ac = new AbortController();
const { signal } = ac;

const TIMEOUT_VAL = 500

function forceAbort() { ac.abort() }

setTimeout(TIMEOUT_VAL).then(forceAbort);

console.log('1: done with setup, starting try/catch')
try {
  console.log('2: prior to await')

  // pass the signal to the once handler to interact with the abortController
  await once(uneventful, 'ping', { signal });
  console.log('3: after await');
} catch (err) {
  // ignore abort errors:
  console.log('err.code')
  console.log(err.code)
  
  if (err.code !== 'ABORT_ERR') throw err;
  console.log('canceled');
}
