const store = require('./store')
const { equal, throws, doesNotThrow, ifError, deepStrictEqual } = require('assert')

const ERR_STR = 'input must be a buffer'
const NO_BUFFER_ERR = Error(ERR_STR)

// NO-DICE
// throws(() => store(1234, (a) => {console.log(a)}),NO_BUFFER_ERR)

// NO DICE AGAIN
// function ifErrorCB(data){
//   ifError(data)
// }

// store(1234, ifErrorCB)


// SUCCESS
function dseCB(err,data){
  // ASSERT IN THE CB RESPONSE HERE
  deepStrictEqual(err, NO_BUFFER_ERR)
}

function ifErrorCB(err, data){
  ifError(err)
}

doesNotThrow(() => store(Buffer.from('1234'),(res) => {}))
store(1234, dseCB)

// asserts no error
store(Buffer.from('123456789'), ifErrorCB)

// assert res.id.length === 4
store(Buffer.from('123456789'),(n, obj) => {
  console.log('obj')
  console.log(obj)
  equal(obj.id.length, 4)
})