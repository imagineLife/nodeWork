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
*/ 