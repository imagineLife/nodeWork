//Dependency
const http = require('http');
const port = 3000;
const url = require('url')
const stringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {

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
		console.log('incoming data')
		console.log(data)
		curIncomingString += decoder.write(data)
	})

	//when request object emits the end event
	//end the decoder...
	req.on('end', () => {

		curIncomingString += decoder.end();

		//choose the handler this request should go to
		let chosenHandler = typeof(myRouter[trimmedPathTxt]) !== 'undefined' ? myRouter[trimmedPathTxt] : routeHandlers.notFound;

		// object to send to the handler
		let dataToReturn = {
			trimmedPath: trimmedPathTxt,
			queryStrObj: queryString,
			method: reqMethod,
			headers: hdrs,
			payload: curIncomingString
		}

		chosenHandler(dataToReturn, function(statusCode, payload){

			//defaults if none given
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
			payload = typeof(payload) === 'object' ? payload : {};

			const payloadStr = JSON.stringify(payload)

			//writeHead comes on a response object, writitng the status code to the head
			//1.set heater
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadStr);

			//'log' the request path
			console.log('returning statusCode & payloadStr')
			console.log(statusCode)
			console.log(payloadStr)

		})

	})
})

//Start the server, listen on port 3000
server.listen(port, () => console.log(`Server is listening on port ${port}!!`))

let routeHandlers = {}

routeHandlers.default = function(data, callback){
	//5. callabck an http status code
	//	and a payload, an object
	callback(406, {'name': 'default handler here!'});
}

routeHandlers.notFound = function(data, callback){
	callback(404)
}

const myRouter = {
	//a default path
	'default': routeHandlers.default
}


/*
NOTE: 

	GOAL HERE
	tell the user that we are returning them json
	how? send header content-type app/json

	TEST THIS with postman:
	go to localhost:3000/something
		see the error response
	go to localhost:3000/default
		content-type in headers
		the response LOOKS nicer, because postman /browser 'knows' its json
*/

