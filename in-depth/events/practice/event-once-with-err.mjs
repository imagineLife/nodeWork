import { once, EventEmitter } from 'events';
import { setTimeout } from 'timers/promises';


const uneventful = new EventEmitter();
const ac = new AbortController();
const { signal } = ac;

console.log('1')
console.log('2')

setTimeout(500).then(() => ac.abort());

try {
  console.log('3');
  await once(uneventful, 'ping', { signal });
  uneventful.emit('ping')
  console.log('4');
} catch (err) {
  console.log('---catch err.code---', err.code);
  console.log('5');
  // ignore abort errors:
  if (err.code !== 'ABORT_ERR') throw err;
  console.log('6');
}