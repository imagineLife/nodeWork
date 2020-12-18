const { throws, doesNotThrow} = require('assert')
const FAIL_ERR = Error('inputs must be numbers')
const add = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw FAIL_ERR
  }
  return a + b
}
throws(() => add('5', '5'), FAIL_ERR)
doesNotThrow(() => add(5, 5))

/*
  NOTICE
  the test of `add`
  is wrapped in an anonymous fn
*/