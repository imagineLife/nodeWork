const http = require('http')
const passedURL = process.argv[2];

http.get(passedURL, res => {
	res.setEncoding('utf8')
	res.on('data', data => console.log(data))
})