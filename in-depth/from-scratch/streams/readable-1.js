const { Readable } = require('stream');

let sourceArr = ['abc','this is a long string here', 'animal', ['itm', 'itm2','itm23'].toString()]

function dataHandler(d){
  console.log(`got data`)
  console.log(d)
  console.log('// - - - - - //')
}

function makeReadStream(){
  return new Readable({
    read(size){
      console.log(`READING fn, size ->`, size)
      if(sourceArr.length === 0 ){
        this.push(null)
      }else{
        console.log('has length')
        console.log('sourceArr')
        console.log(sourceArr)
        this.push(sourceArr.shift())
      }
    }
  })
}
const rs = makeReadStream()

rs.on('data',dataHandler)