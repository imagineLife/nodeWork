const net = require('net')
const portToListenOn = process.argv[2]

function optLeadingZero(i) {
  return (i < 10 ? '0' : '') + i
}

const makeCurTime = () => {
	const d = new Date()
  return d.getFullYear() + '-'
    + optLeadingZero(d.getMonth() + 1) + '-'
    + optLeadingZero(d.getDate()) + ' '
    + optLeadingZero(d.getHours()) + ':'
    + optLeadingZero(d.getMinutes())
}
const tcpS = net.createServer(tcpSocket => {
	tcpSocket.end(makeCurTime() + `\n`)
})

tcpS.listen(portToListenOn)