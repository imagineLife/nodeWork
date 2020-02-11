// https://nodejs.org/api/http2.html#http2_http_2
const http2 = require('http2')

const cnxnString = `http://localhost:6000`
const client = http2.connect(cnxnString)

let resStr = ``

const req = client.request({
	':path': '/'
})

const handleIncomingData = (chunk) => {
	resStr += chunk
}

req.on('data', handleIncomingData)
req.on('end', () => { 
	console.log('stream ended')
	console.log(resStr)
 })

req.end()