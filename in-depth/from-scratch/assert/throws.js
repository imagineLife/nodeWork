const { throws, doesNotThrow } = require('assert')

const numErr = Error('input args must be numbers')
function sub(a,b){
  if(typeof a !== 'number' || typeof b !== 'number') throw numErr
  return a - b;
}

throws(() => sub('a',2), numErr)
doesNotThrow(() => sub(4,2), numErr)