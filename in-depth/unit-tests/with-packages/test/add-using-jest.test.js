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
  NOTES
  - `test` and `expect` are fns made available
    at execution time by the jst module
  - NEED to run using jest in-order to use the
    `test` and `expect` vars
    `./node_modules/.bin/jest test/add-using-jest.test.js`

    RESULTS
     PASS  test/add-using-jest.test.js
    ✓ throw when inputs are not numbers (4 ms)
    ✓ adds two numbers (1 ms)

    Test Suites: 1 passed, 1 total
    Tests:       2 passed, 2 total
    Snapshots:   0 total
    Time:        1.726 s
    Ran all test suites matching /test\/add-using-jest.test.js/i.
*/ 
