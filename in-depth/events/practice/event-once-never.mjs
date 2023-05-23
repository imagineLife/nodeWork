import { once, EventEmitter } from 'events';
// import { setTimeout } from 'timers/promises';

console.log('1: start')

const uneventful = new EventEmitter();
await once(uneventful, 'ping');
console.log('2: after await once');