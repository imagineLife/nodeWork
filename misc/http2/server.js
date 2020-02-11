// https://nodejs.org/api/http2.html#http2_http_2
const http2 = require('http2')

const server = http2.createServer()

const hwText = `<html><body><p>http2 server...</p></body></html>`

const streamHandler = (stream,headers) => {
	stream.respond({
		':status':200,
		'content-type': 'text/html'
	})
	stream.end(hwText)
}

server.on('stream', streamHandler)

server.listen(6000)