const { promisify } = require('util')

const timeout = promisify(setTimeout)
const DURATION = 300
const BAD_URL = 'http://error.com'
const NW_ERROR = Error('network error')
const RES_STR = 'some data'

module.exports = async (url) => {
  await timeout(DURATION)
  if (url === BAD_URL) throw NW_ERROR
  return Buffer.from(RES_STR)
}