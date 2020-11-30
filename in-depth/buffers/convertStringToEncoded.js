/*
  starts as a string
  uses buffer api
  converts to a base64 encoded string
*/ 
'use strict';
const assert = require('assert');
const str = 'buffers are neat';
const buffStr = Buffer.from(str);
const base64Res = buffStr.toString('base64');
console.log({base64Res})
assert.equal(base64Res, Buffer.from([  89,110,86,109,90,109,86,121,99,  121,66,104,99,109,85,103,98,109,  86,104,100,65,61,61]))
console.log('passed!!')