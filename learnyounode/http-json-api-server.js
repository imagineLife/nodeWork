const http = require('http')
const fs = require('fs')
const stringDecoder = require('string_decoder').StringDecoder;
const decoder = new stringDecoder('utf-8');
const url = require('url');

function optLeadingZero(i) {
  return (i < 10 ? '0' : '') + i
}

const getTimeParts = (v, isUnix) => {
	
	let thisTime = new Date(v)

	if(isUnix){
		return { unixtime: thisTime.getTime() }
	} 
	return {
		hour: parseInt(optLeadingZero(thisTime.getHours())),
		minute: parseInt(optLeadingZero(thisTime.getMinutes())),
		second: parseInt(optLeadingZero(thisTime.getSeconds())),
	}
}

const providedPort = process.argv[2]

const server = http.createServer((req,res) => {
	
	//get http method that was used. its in the req object
	const reqMethod = req.method.toLowerCase()
	//get & parse the url
	const parsedUrl = url.parse(req.url,true);

	//get the 'path' name from the url, trim the pathText
	const pathText = parsedUrl.pathname;
	const trimmedPathTxt = pathText.replace(/^\/+|\/+$/g,'')

	//Get the query String as an Object
	const passedISO = parsedUrl.query.iso;
	
	if(reqMethod === 'get' && trimmedPathTxt == 'api/parsetime'){
		req.on('data', () => {})
		req.on('end', () => {
			const parsedTime = getTimeParts(passedISO)
			res.end(JSON.stringify(parsedTime));
		})
	}

	if(reqMethod === 'get' && trimmedPathTxt == 'api/unixtime'){
		req.on('data', () => {})
		req.on('end', () => {
			const parsedTime = getTimeParts(passedISO, true)
			res.end(JSON.stringify(parsedTime));
		})
	}

})

server.listen(providedPort)