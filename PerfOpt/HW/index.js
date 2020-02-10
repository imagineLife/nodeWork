//Dependencies
const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const envConfig = require('./config');
var cluster = require('cluster');
var os = require('os');

//instantiating http server
const httpServer = http.createServer((req, res) => {
	sharedServer(req,res)
})

//Start the servers, listen on port 3000
httpServer.listen(envConfig.httpPort, () => console.log(`Server is listening on port ${envConfig.httpPort} in environment ${envConfig.friendlyEnvName} mode!!`))

//build route-handlers
let routeHandlers = {}

//helloWorld handler
routeHandlers.hello = (data, callback) => {
	let res = (data.method == 'post') ? callback(200, { message: 'HELLO PIRPLEWURLD!' }) : callback(200, {message: 'try posting to /hello!'})
}

routeHandlers.notFound = (data, callback) => callback(404);

//build router lookup object
const myRouter = { 'hello': routeHandlers.hello }

//Create http server
const sharedServer = (req, res) => {
	
	//include the encoding, utf-8
	const decoder = new stringDecoder('utf-8');

	//get & parse the url
	const parsedUrl = url.parse(req.url,true);

	//get the 'path' & queryString from the url, trim the pathname
	const {pathname, query} = parsedUrl
	const trimmedPathTxt = pathname.replace(/^\/+|\/+$/g,'')

	//get http method that was used. its in the req object
	const reqMethod = req.method.toLowerCase()

	//get requested headers
	const hdrs = req.headers;

	//incomingData var
	let curIncomingString = ''

	//collect data
	req.on('data', data => curIncomingString += decoder.write(data))

	//
	req.on('end', () => {

		curIncomingString += decoder.end();

		//set the handler this request should go to
		const chosenHandler = typeof(myRouter[trimmedPathTxt]) !== 'undefined' ? myRouter[trimmedPathTxt] : routeHandlers.notFound;

		// object to send to the handler
		let dataToReturn = {
			trimmedPath: trimmedPathTxt,
			queryStrObj: query,
			method: reqMethod,
			headers: hdrs,
			payload: curIncomingString
		}

		chosenHandler(dataToReturn, (statusCode, payload) => {

			//defaults if none given
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
			payload = typeof(payload) === 'object' ? payload : {};

			const payloadStr = JSON.stringify(payload)

			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadStr);
		})

	})

}