const { test } = require('tap')
const req = require('../req')

const NW_ERR = Error('network error')
const ERR_URL = 'http://error.com'
const GOOD_URL = 'http://example.com'
const ASSUMED_SUCCESSFUL_RES_STR = 'some data'
test('handles network errors', ({ strictDeepEqual, end }) => {
  req(ERR_URL, (err) => {
    strictDeepEqual(err, NW_ERR)
    end()
  })
})

test('responds with data', ({ ok, strictDeepEqual, ifError, end }) => {
  req(GOOD_URL, (err, data) => {
    ifError(err)
    
    /*
      check for truthiness that
        the buffer returned from the request callback...
        ...is a buffer 
    */ 
    ok(Buffer.isBuffer(data))

    // strictDeepEqual works same as node's assert.deepStrictEqual
    strictDeepEqual(data, Buffer.from(ASSUMED_SUCCESSFUL_RES_STR))

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
  - handles network errors
    - deep equality check on mock request err && in-file error obj
    leveraging callbacks instead of async fns (async fns can be seen in add test)
    - manually call end fn
      - end fn is an available param that test passes in callback-built fns
      - call end @ the end of the req fn
    
*/ 