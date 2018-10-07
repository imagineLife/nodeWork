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

		//6. choose the handler this request should go to,
		// 	here either notFound or default
		let chosenHandler = typeof(myRouter[trimmedPathTxt]) !== 'undefined' ? myRouter[trimmedPathTxt] : routeHandlers.notFound;

		//7. Construct a data object to send to the handler
		let dataToReturn = {
			trimmedPath: trimmedPathTxt,
			queryStrObj: queryString,
			method: reqMethod,
			headers: hdrs,
			payload: curIncomingString
		}

		//8. route the request to the handler specified in the router
		chosenHandler(dataToReturn, function(statusCode, payload){

			//9. define some sensible defaults for a status code & payload
			//sometimes there wont be any called by the handler
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
			payload = typeof(payload) === 'object' ? payload : {};

			//10. sending a STRING, converting the payload object to a string
			const payloadStr = JSON.stringify(payload)

			//11. return the response
			//writeHead comes on a response object, writitng the status code to the head
			res.writeHead(statusCode);
			res.end(payloadStr);

			//'log' the request path
			console.log('returning statusCode & payloadStr')
			console.log(statusCode)
			console.log(payloadStr)

		})

		//moved this from OUTSIDE this event, moved INTO this end callback
		// send the response
		//THIS GETS MOVED TO # 11 above
		// res.end('basic node server response string\n');

	})
})

//Start the server, listen on port 3000
server.listen(port, () => console.log(`Server is listening on port ${port}!!`))

//2. Define route handlers
let routeHandlers = {}

//3.define default handler
routeHandlers.default = function(data, callback){
	//5. callabck an http status code
	//	and a payload, an object
	callback(406, {'name': 'default handler here!'});
}

//4.define error handler
routeHandlers.notFound = function(data, callback){
	callback(404)
}

//1. Define a request router
const myRouter = {
	//a default path
	'default': routeHandlers.default
}


/*
NOTE: 
	- we know url
	- we know the query strings
	- we know which http method they are sending
	- we know headers
	- we know payload being sent
	GOAL OF THIS
	- WANT to package returned payload as an object, send it or 'route it'
		- setup routing structure, router
		- if they ask for /foo, that should go to 'foo handler'
		- need to match request paths to their respeective handlers
		- go to a default 404 if not defined

	TEST THIS with postman:
	go to localhost:3000/something
		see the error response
	go to localhost:3000/default
		see the default response
		see the 406 response too!!
*/
