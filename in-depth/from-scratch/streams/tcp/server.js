const net = require('net');
const CONN_STR = 'server connected'
const PORT = 4321
const HB_TIME = 1000
const HB_STR =`server heart-beat`

function serverCallback(connectedSocket){
  console.log(CONN_STR)
  
  connectedSocket.on('data', d => {
    connectedSocket.write(d.toString().toUpperCase())
  })
  
  const HB_TIMER = setInterval(() => {
     connectedSocket.write(HB_STR)
  }, HB_TIME)

  connectedSocket.on('end', () => clearInterval(HB_TIMER))
}

function errCallback(e){
  console.log(`ERROR`)
  console.log(e);
}

const server = net.createServer(serverCallback)
server.on('error', errCallback)
server.listen(4321, () => console.log(`server listening`))