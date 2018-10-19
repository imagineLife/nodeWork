//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const envConfig = require('./config');
const fs = require('fs');

//instantiating http server
const httpServer = http.createServer((req, res) => {
	sharedServer(req,res)
})

//create httpsServerOptions
const httpsServerOptions = {
	'key' : fs.readFileSync('./https/key.pem'),
	'cert' : fs.readFileSync('./https/cert.pem')
}

//start https server
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
	sharedServer(req,res)
})

//Start the servers, listen on port 3000
httpServer.listen(envConfig.httpPort, () => console.log(`Server is listening on port ${envConfig.httpPort} in environment ${envConfig.friendlyEnvName} mode!!`))
httpsServer.listen(envConfig.httpsPort, () => console.log(`Server is listening on port ${envConfig.httpsPort} in environment ${envConfig.friendlyEnvName} mode!!`))

let routeHandlers = {}


//ping handler
routeHandlers.ping = (data, callback) => { callback(200) };

//helloWorld handler
routeHandlers.hello = (data, callback) => {
	console.log('hello data')
	console.log(data)
	let res = (data.method == 'post') ? callback(200, { message: 'HELLO PIRPLEWURLD!' }) : callback(200, {message: 'try posting to /hello!'})
}

routeHandlers.notFound = (data, callback) => {
	callback(404)
}

const myRouter = {
	'ping': routeHandlers.ping,
	'hello': routeHandlers.hello
}

//Sharing logic to create http & https servers
const sharedServer = (req, res) => {

	//get & parse the url
	const parsedUrl = url.parse(req.url,true);

	//get the 'path' name from the url, trim the pathname
	//Get the query String as an Object
	const {pathname, query} = parsedUrl
	const trimmedPathTxt = pathname.replace(/^\/+|\/+$/g,'')

	//get http method that was used. its in the req object
	const reqMethod = req.method.toLowerCase()

	//get requested headers
	const hdrs = req.headers;

	//include the encoding, utf-8
	const decoder = new stringDecoder('utf-8');

	//as new data comes in, it gets added to this var
	let curIncomingString = ''

	//when request objects emits event data, pass the data to a callback
	//append the new incoming data to the curIncomingString with the decoder
	req.on('data', data => {
		curIncomingString += decoder.write(data)
	})

	//when request object emits the end event
	//end the decoder...
	req.on('end', () => {

		curIncomingString += decoder.end();

		//choose the handler this request should go to
		const chosenHandler = typeof(myRouter[trimmedPathTxt]) !== 'undefined' ? myRouter[trimmedPathTxt] : routeHandlers.notFound;

		// object to send to the handler
		let dataToReturn = {
			trimmedPath: trimmedPathTxt,
			queryStrObj: query,
			method: reqMethod,
			headers: hdrs,
			payload: curIncomingString
		}

		chosenHandler(dataToReturn, (statusCode, payload) =>{

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



/*
NOTE: 
adding a PING route
	making a handler for this route
		calls back 200
		so that i can monitor the app, find out if it is alive or not
	/ping will not have effect on the server, just send back 200

1. comment, will remove, 'default' route
2.

test this by 1.
node index.js
NODE_ENV=staging node index.js
NODE_ENV=prod node index.js

*/

