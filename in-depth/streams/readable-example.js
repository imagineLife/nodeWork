'use strict';
let startTime = new Date();

const fs = require('fs');
const path = require('path')
const txtFile = path.join(__dirname,'lorem.txt')
let resBuffer = ''

// prep fns for even handlers
function dataHandler(d){
  console.log('---d---')
  console.log(d)
  resBuffer += d.toString();
}

function endHandler(){
  console.log('finished reading!')
  console.log(resBuffer.length)
  let endTime = new Date()
  console.log('DURATION: ', endTime - startTime)
}

const rs = fs.createReadStream(txtFile) //{highWaterMark: 20}

// register event handlers
rs.on('data', dataHandler)
rs.on('end', endHandler)