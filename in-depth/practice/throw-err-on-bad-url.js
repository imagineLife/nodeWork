const assert = require('assert')

// ORIGINAL FN
// function parseUrl (str) {
//   const parsed = new URL(str)
//   return parsed
// }

// GOAL, don't error out on bad url
function parseUrl (str) {
  try{
    const parsed = new URL(str)
    return parsed
  }catch(e){
    return null
  }
}

assert.doesNotThrow(
  () => { 
    parseUrl('invalid-url') 
  }
)

assert.equal(parseUrl('invalid-url'), null)

assert.deepEqual(
  parseUrl('http://example.com'),
  new URL('http://example.com')
)

console.log('passed!')