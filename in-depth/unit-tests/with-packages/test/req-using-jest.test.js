const req = require('../req')

const BAD_URL = 'http://error.com'
const ASSUMED_ERR_STR = 'network error'
const ASSUMED_ERR = Error(ASSUMED_ERR_STR)
const GOOD_URL = 'http://example.com'
const ASSUMED_GOOD_RES_STR = 'some data'

// assures expected error
test('handles network errors', (done) => {
  req(BAD_URL, (err) => {
    expect(err).toStrictEqual(ASSUMED_ERR)
    done()
  })
})

// assures expected response
test('responds with data', (done) => {
  req(GOOD_URL, (err, data) => {
    expect(err == null).toBe(true)
    expect(Buffer.isBuffer(data)).toBeTruthy()
    expect(data).toStrictEqual(Buffer.from(ASSUMED_GOOD_RES_STR))
    done()
  })
})


/*
  Run using
  npm run test -- --coverage req-using-jest.test.js

  RESPONSE
  > jest "--coverage" "req-using-jest.test.js"

 PASS  test/req-using-jest.test.js
  ✓ handles network errors (305 ms)
  ✓ responds with data (305 ms)

  ----------|---------|----------|---------|---------|-------------------
  File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
  ----------|---------|----------|---------|---------|-------------------
  All files |     100 |      100 |     100 |     100 |                   
   req.js   |     100 |      100 |     100 |     100 |                   
  ----------|---------|----------|---------|---------|-------------------
  Test Suites: 1 passed, 1 total
  Tests:       2 passed, 2 total
  Snapshots:   0 total
  Time:        2.561 s



  NOTES
  - `test` && `expect` come from jest
  - testing responds with data
    - assuring err == null.toBe(true)
      - coercive quality check
    - assuring Buffer.isBuffer
      - toBeTruthy is like testiting `ok` in the tap test approach
*/ 