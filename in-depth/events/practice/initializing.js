// const EE = require('events')
// const  { EventEmitter } = EE

// const myEmitter = new EE()
// myEmitter.on('horse', (d) => console.log('on horse'))
// myEmitter.emit('horse')

// class MyEmitter extends EE {
//   constructor(opts = {}) {
//     super(opts);
//     this.name = opts.name;
//   }
// }
// const newE = new MyEmitter()
// myEmitter.on('dog', (d) => console.log('on dog'));
// myEmitter.emit('dog');

// const lastEv = new EventEmitter();
// lastEv.on('water', (d) => console.log('on water'));
// lastEv.emit('water');


const { EventEmitter } = require('events');
const ee = new EventEmitter();
const EVENT_NAME = 'example';
function onEvent() {
  console.log('on the event!');
}

function onPrepend() {
  console.log('on prepend');
}
console.log('1');
ee.on(EVENT_NAME, onEvent);

ee.prependListener(EVENT_NAME, onPrepend);

ee.emit(EVENT_NAME);
console.log('2');
ee.emit(EVENT_NAME);
console.log('3');