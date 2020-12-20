// make Jest work with nodes setTimeout instead of overriding it
global.setTimeout = require('timers').setTimeout
const req = require('../req-prom')

const BAD_URL_REQ_PROM = 'http://error.com'
const GOOD_URL = 'http://example.com'
const ERR_REQ_PROM = Error('network error')
const ASSUMED_GOOD_RESP_STR = 'some data'

test('handles network errors', async () => {
  await expect(req(BAD_URL_REQ_PROM))
    .rejects
    .toStrictEqual(ERR_REQ_PROM)
})

test('responds with data', async () => {
  const data = await req(GOOD_URL)
  expect(Buffer.isBuffer(data)).toBeTruthy()
  expect(data).toStrictEqual(Buffer.from(ASSUMED_GOOD_RESP_STR))
})