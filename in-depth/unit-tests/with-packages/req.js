const DURATION = 300;
const BAD_URL = 'http://error.com'
const NW_ERR = Error('network error')
const STR = 'some data'

module.exports = (url, cb) => {
  setTimeout(() => {
    if (url === BAD_URL) cb(NW_ERR)
    else cb(null, Buffer.from(STR)) 
  }, DURATION)
}