import { once, EventEmitter } from 'events';
// import { setTimeout } from 'timers/promises';

console.log('1')

const uneventful = new EventEmitter();
console.log('2');
await once(uneventful, 'ping');
console.log('3');