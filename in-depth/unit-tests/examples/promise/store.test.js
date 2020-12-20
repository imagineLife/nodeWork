const store = require('./store');
const {equal, throws, rejects, doesNotReject} = require('assert');

const ASUMED_ERR = Error('input must be a buffer')

// async function runTests(){
  // NOPE
  // let res = await store('1234')
  // throws(res,ASUMED_ERR)

  // NOPE
  // throws(() => store('1234'), ASUMED_ERR)

  // NOPE
  // equal(async () => await store('1234'), ASUMED_ERR)

  // NOPE
  // try{
  //   await store('1234')
  // }catch(e){
  //   equal(e, {Error: 'input must be a buffer'})
  // }

  rejects(store('1234'), ASUMED_ERR)
// }

  // test('responds with data', async ({ ok, strictDeepEqual }) => {
  //   const data = await req(GOOD_URL)
  //   ok(Buffer.isBuffer(data))
  //   strictDeepEqual(data, Buffer.from(ASSUMED_SUCCESS_RESPONSE_STR))
  // })

  doesNotReject(store(Buffer.from('1234')))



// runTests()

async function runTests(){
  let res = await store(Buffer.from('1234'))
  equal(res.id.length,4)
}

runTests()