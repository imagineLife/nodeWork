// a tcp 'client', made to connect to the duplex-example server 

'use strict'
const net = require('net')
const port = 3000
const connectedNet = net.connect(port)
const killAfterTime = 3500;
const shortTime = 250
function handleData(data){
  console.log('got data:', data.toString())
}

connectedNet.on('data', handleData)

setTimeout(() => {
  connectedNet.write('finished')
  setTimeout(() => {
    connectedNet.end()
  }, shortTime)
}, killAfterTime)