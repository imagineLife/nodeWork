// Dependencies
const add = require('../add')

const MUST_BE_NUM_ERR = Error('inputs must be numbers')

test('throw when inputs are not numbers', async () => {
  expect(() => add('5', '5')).toThrowError(MUST_BE_NUM_ERR)
  expect(() => add(5, '5')).toThrowError(MUST_BE_NUM_ERR)
  expect(() => add('5', 5)).toThrowError(MUST_BE_NUM_ERR)
  expect(() => add({}, null)).toThrowError(MUST_BE_NUM_ERR)
})

test('adds two numbers', async () => {
  expect(add(5, 5)).toStrictEqual(10)
  expect(add(-5, 5)).toStrictEqual(0)
})


/*

*/ 