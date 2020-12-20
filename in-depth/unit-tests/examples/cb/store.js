const ERR_STR = 'input must be a buffer'
const NO_BUFFER_ERR = Error(ERR_STR)
module.exports = (value, cb) => {
  if (Buffer.isBuffer(value) === false) {
    cb(NO_BUFFER_ERR)
    return
  }
  setTimeout(() => {
    const id = Math.random().toString(36).split('.')[1].slice(0, 4)
    cb(null, { id })
  }, 300)
}
