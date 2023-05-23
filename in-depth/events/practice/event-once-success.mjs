import { once, EventEmitter } from 'events';
// import { setTimeout } from 'timers/promises';

console.log('1: start')

const uneventful = new EventEmitter();
setTimeout(() => { uneventful.emit('ping') }, 500)

console.log('2: setting up await');
await once(uneventful, 'ping');
console.log('3: immediately after the await line');
