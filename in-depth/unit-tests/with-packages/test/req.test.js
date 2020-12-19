const { test } = require('tap')
const req = require('../req')

const NW_ERR = Error('network error')
const ERR_URL = 'http://error.com'
const GOOD_URL = 'http://example.com'
test('handles network errors', ({ strictDeepEqual, end }) => {
  req(ERR_URL, (err) => {
    strictDeepEqual(err, NW_ERR)
    end()
  })
})

test('responds with data', ({ ok, strictDeepEqual, ifError, end }) => {
  req(GOOD_URL, (err, data) => {
    ifError(err)
    ok(Buffer.isBuffer(data))
    strictDeepEqual(data, Buffer.from('some data'))
    end()
  })
})


/*
  Running above with `node req.test.js` returns...
    TAP version 13
    # Subtest: handles network errors
        ok 1 - should be equivalent strictly
        1..1
    ok 1 - handles network errors # time=312.205ms

    # Subtest: responds with data
        ok 1 - should not error
        ok 2 - expect truthy value
        ok 3 - should be equivalent strictly
        1..3
    ok 2 - responds with data # time=307.568ms

    1..2
    # time=629.002ms


  NOTES:
  - 
*/ 