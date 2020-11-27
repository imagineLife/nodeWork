// 'use strict';
// const assert = require('assert');
// const { EventEmitter } = require('events');
// const thisTry = new EventEmitter();
// let count = 0;

// thisTry.once('tick', listener);

// // listener gets called 1x
// setInterval(() => {  
//   thisTry.emit('tick')
// }, 100);

// function listener () {  
//   count++  
//   setTimeout(() => {
//     assert.equal(count, 1)
//     assert.equal(this, thisTry)
//     console.log('passed!')  
//   }, 250)
// }