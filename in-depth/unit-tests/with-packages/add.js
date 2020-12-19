const NUM_ERR = Error('inputs must be numbers')
module.exports = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw NUM_ERR
  }
  return a + b
}