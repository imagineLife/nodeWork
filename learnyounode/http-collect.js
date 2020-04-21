const http = require('http')
const passedURL = process.argv[2];

http.get(passedURL, res => {
	let resStr = ''
	res.setEncoding('utf8')
	res.on('data', data => {
		resStr += data;
	})
	res.on('end', () => {
		console.log(resStr.length)
		console.log(resStr)
	})
})