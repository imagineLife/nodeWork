const { test } = require('tap')
const req = require('../req-prom')

const BAD_URL = 'http://error.com'
const GOOD_URL = 'http://example.com'
const ASSUMED_BAD_RES_STR = 'network error'
const BAD_REQ_ERR = Error(ASSUMED_BAD_RES_STR)
const ASSUMED_SUCCESS_RESPONSE_STR = 'some data'

test('handles network errors', async ({ rejects }) => {
  await rejects(req(BAD_URL), BAD_REQ_ERR)
})

test('responds with data', async ({ ok, strictDeepEqual }) => {
  const data = await req(GOOD_URL)
  ok(Buffer.isBuffer(data))
  strictDeepEqual(data, Buffer.from(ASSUMED_SUCCESS_RESPONSE_STR))
})

/*
  notes
  same tests as the req.test.js, but HERE requests using promises instead of callbacks

  - handles network errors
    - assures a rejected promise  match between
     - req to bad url
     - in-file written error obj
     - `rejects` returns a promise
     - the async fn `req` does not resolve && ends the test
     - the promise passed to rejects is...rejected with an arr
  - responds with data
    - saves request response as data var
      - NOTE awaiting the response of the request promise
    - assures data is a buffer
    - assure deep obj equality between the response data 
      and a Buffer made from the assumed succesful response string
*/ 