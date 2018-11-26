//SERVER-reated tasks

//Dependency
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const envConfig = require('./config');
const fs = require('fs');
const routeHandlers = require('./handlers');
const helpers = require('./helpers')
const path = require('path');

//instantiates a server module Obj
let serverObj = {};


//instantiating http server
serverObj.httpServer = http.createServer((req, res) => {
	serverObj.sharedServer(req,res)
})

//create httpsServerOptions
//read in key & cert from https file directory
serverObj.httpsServerOptions = {
	'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
	'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
}

//start https server
serverObj.httpsServer = https.createServer(serverObj.httpsServerOptions, (req, res) => {
	serverObj.sharedServer(req,res)
})

serverObj.myRouter = {
	'ping': routeHandlers.ping,
	'users': routeHandlers.users,
	'tokens' : routeHandlers.tokens,
	'checks': routeHandlers.checks
}

//Sharing logic to create http & https servers
serverObj.sharedServer = (req, res) => {

	//get & parse the url
	const parsedUrl = url.parse(req.url,true);

	//get the 'path' name from the url, trim the pathText
	const pathText = parsedUrl.pathname;
	const trimmedPathTxt = pathText.replace(/^\/+|\/+$/g,'')

	//Get the query String as an Object
	/* when a url is sent with query strings, the querys will get put in the queryString*/
	const queryString = parsedUrl.query;
	
	//get http method that was used. its in the req object
	const reqMethod = req.method.toLowerCase()

	//get requested headers
	const hdrs = req.headers;

	//get the payload, if is one
	//include the encoding, utf-8
	const decoder = new stringDecoder('utf-8');

	//as new data comes in, it gets added to this var
	let curIncomingString = ''

	//when request objects emits event data, pass the data to a callback
	//append the new incoming data to the curIncomingString with the decoder
	req.on('data', data => {
		// console.log('incoming data')
		// console.log(data)
		curIncomingString += decoder.write(data)
	})

	//when request object emits the end event
	//end the decoder...
	req.on('end', () => {

		curIncomingString += decoder.end();

		//choose the handler this request should go to
		let chosenHandler = typeof(serverObj.myRouter[trimmedPathTxt]) !== 'undefined' ? serverObj.myRouter[trimmedPathTxt] : routeHandlers.notFound;

		// object to send to the handler
		let dataToReturn = {
			trimmedPath: trimmedPathTxt,
			queryStrObj: queryString,
			method: reqMethod,
			headers: hdrs,
			//PARSING the paload data with helpers method
			payload: helpers.parseJsonToObject(curIncomingString)
		}

		chosenHandler(dataToReturn, (statusCode, payload) =>{
			// console.log('chosenHandler dataToReturn, statusCode & payload')
			// console.log(dataToReturn)
			// console.log(statusCode)
			// console.log(payload)

			//defaults if none given
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
			payload = typeof(payload) === 'object' ? payload : {};

			const payloadStr = JSON.stringify(payload)

			//writeHead comes on a response object, writitng the status code to the head
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadStr);

			//'log' the request path
			// console.log('returning statusCode & payloadStr')
			// console.log(statusCode)
			// console.log(payloadStr)

		})

	})

}

//initialize server script
serverObj.init = () => {
	//Start the httpServer, listen on port 3000
	serverObj.httpServer.listen(envConfig.httpPort, () => console.log(`Server is listening on port ${envConfig.httpPort} in environment ${envConfig.friendlyEnvName} mode!!`))

	//Start the httpsServer, listen on port 3001
	serverObj.httpsServer.listen(envConfig.httpsPort, () => console.log(`Server is listening on port ${envConfig.httpsPort} in environment ${envConfig.friendlyEnvName} mode!!`))
}


module.exports = serverObj;