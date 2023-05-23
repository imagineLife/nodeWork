import { once, EventEmitter } from 'events';
console.log('1')

const uneventful = new EventEmitter();
console.log('2');
await once(uneventful, 'ping');
console.log('3');
