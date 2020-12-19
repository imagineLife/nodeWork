const { 
  throws, 
  doesNotThrow, 
  ifError,
  deepStrictEqual
} = require('assert')
const FAIL_ERR = Error('inputs must be numbers')
const add = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw FAIL_ERR
  }
  return a + b
}
throws(() => add('5', '5'), FAIL_ERR)
doesNotThrow(() => add(5, 5))

/*
  NOTICE on above
  the test of `add`
  is wrapped in an anonymous fn
*/


const TIME_VAL = 300
const ERR_URL = 'http://error.com'
const FAKE_DATA_STR = 'fake data string'
const ERR_STR = 'network error'
const REAL_URL = 'http://example.com'
const ERR_OBJ = Error(ERR_STR)

const mockRequest = (reqURL, cb) => {
  setTimeout(() => {
    if(reqURL === ERR_URL) cb(ERR_OBJ)
    else cb(null, Buffer.from(FAKE_DATA_STR))
  }, TIME_VAL)
}

function ifErrorCB(err, data){
  ifError(err)
}

function dseCB(err,data){
  deepStrictEqual(err, ERR_OBJ)
}

mockRequest(REAL_URL, ifErrorCB)

mockRequest(ERR_URL, dseCB)


/*
  NOTICE on above
  - built a mockRequest, simulating a fetch req
    - includes a callback
  - 
*/ 