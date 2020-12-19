// Dependencies
const { test } = require('tap')
const add = require('../add')

const MUST_BE_NUM_ERR = Error('inputs must be numbers')

test('throw when inputs are not numbers', async ({ throws }) => {
  throws(() => add('5', '5'), )
  throws(() => add(5, '5'), MUST_BE_NUM_ERR)
  throws(() => add('5', 5), MUST_BE_NUM_ERR)
  throws(() => add({}, null), MUST_BE_NUM_ERR)
})

test('adds two numbers', async ({ equal }) => {
  equal(add(5, 5), 10)
  equal(add(-5, 5), 0)
})


/*
  NOTICE
  the async param gets destructured
  - the async param is the assert library


  Run the above with node add.test.js
  RETURNS...
    TAP version 13
    # Subtest: throw when inputs are not numbers
        ok 1 - expected to throw
        ok 2 - expected to throw: Error inputs must be numbers
        ok 3 - expected to throw: Error inputs must be numbers
        ok 4 - expected to throw: Error inputs must be numbers
        1..4
    ok 1 - throw when inputs are not numbers # time=23.526ms

    # Subtest: adds two numbers
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 2 - adds two numbers # time=2.554ms

    1..2
    # time=39.644ms
*/ 