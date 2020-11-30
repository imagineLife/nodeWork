'use strict';
const assert = require('assert');
const b = Buffer.alloc(1024);
console.log(b);
for(const bt of b) assert.equal(bt, b[0]);
console.log('passed!');