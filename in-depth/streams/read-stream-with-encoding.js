/*
  CLONE of contrived-read-stream.js
  ONLY DIFFERENCE is that encoding is set inside readable config obj
*/ 
'use strict';
const { Readable } = require('stream');
const cRS = () => {
  const d = ['demo', 'data', 'in', 'an', 'array of strings'];
  return new Readable({
    // here, encoding is set
    encoding: 'utf8',
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
    demo
    - - -got data- - -
    data
    - - -got data- - -
    in
    - - -got data- - -
    an
    - - -got data- - -
    array of strings
    end handled
*/ 