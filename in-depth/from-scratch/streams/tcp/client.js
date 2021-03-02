const net = require('net');
const CONN_STR = 'client connected'
const PORT = 4321
const HI_STR = 'hello from client!';


const server = net.connect(PORT)

server.on('data', d => {
  console.log('GOT DATA?!')
  console.log(d.toString())
})
server.write(HI_STR)

setTimeout(() =>{
  server.write('client done!')
  setTimeout(() => {
    server.end()
  },250)
},3250)