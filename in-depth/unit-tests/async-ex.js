const assert = require('assert')
const FAIL_ERR = Error('inputs must be numbers')
const add = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw FAIL_ERR
  }
  return a + b
}
assert.throws(() => add('5', '5'), FAIL_ERR)
assert.doesNotThrow(() => add(5, 5))