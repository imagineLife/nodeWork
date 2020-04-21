const http = require('http')
const fs = require('fs')
const stringDecoder = require('string_decoder').StringDecoder;
const decoder = new stringDecoder('utf-8');

const providedPort = process.argv[2]

const server = http.createServer((req,res) => {
	
	//get http method that was used. its in the req object
	const reqMethod = req.method.toLowerCase()
	if(reqMethod === 'post'){
		let curIncomingStr = '';
		req.on('data', chunkData => {
			curIncomingStr += decoder.write(chunkData)
		})

		req.on('end', () => {
			curIncomingStr += decoder.end()
			res.end(curIncomingStr.toUpperCase());
		})
	}

})

server.listen(providedPort)