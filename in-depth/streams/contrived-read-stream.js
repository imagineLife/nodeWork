'use strict';
const { Readable } = require('stream');
const cRS = () => {
  // mock data
  const d = ['demo', 'data', 'in', 'an', 'array of strings'];
  // return the readable stream
  return new Readable({
    read(){
      if(d.length === 0) this.push(null)
      else this.push(d.shift())
    }
  })
}

const rS = cRS()

function dataHandler(d){
  console.log('- - -got data- - -')
  console.log(d)
}
function endHandler(){
  console.log('end handled')
}
rS.on('data',dataHandler)
rS.on('end',endHandler)

/*
  Running this returns...
    - - -got data- - -
    <Buffer 64 65 6d 6f>
    - - -got data- - -
    <Buffer 64 61 74 61>
    - - -got data- - -
    <Buffer 69 6e>
    - - -got data- - -
    <Buffer 61 6e>
    - - -got data- - -
    <Buffer 61 72 72 61 79 20 6f 66 20 73 74 72 69 6e 67 73>
    end handled
*/ 