const { Readable } = require('stream');

/*
  Encoding
  - only works on string inputs

  objectMode
  - can parse js content, without encoding being set
*/ 


/*
  WITHOUT encoding set, this will succeed
  - without encoding, sends buffers to console
  - with encoding set, sends parsed content to console
*/
let sourceArr = [
  'abc',
  'this is a long string here', 
  '1', 
  ['itm', 'itm2','itm23'].toString()
]

/*
  WITH objectMode set, this will succeed
*/ 
// let sourceArr = [
//   'abc',
//   'this is a long string here', 
//   1, 
//   ['itm', 'itm2','itm23']
// ]

function dataHandler(d){
  console.log(`got data`)
  console.log(d)
  console.log('// - - - - - //')
}

function makeReadStream(){
  return new Readable({
    encoding: `utf8`,
    // objectMode: true,
    read(size){
      // console.log(`READING fn, size ->`, size)
      if(sourceArr.length === 0 ){
        this.push(null)
      }else{
        // console.log('has length')
        // console.log('sourceArr')
        // console.log(sourceArr)
        this.push(sourceArr.shift())
      }
    }
  })
}
const rs = makeReadStream()

rs.on('data',dataHandler)