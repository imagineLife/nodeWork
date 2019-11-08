//SERVER-related tasks

//Dependency
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const envConfig = require('./config');
const fs = require('fs');
const routeHandlers = require('./handlers/');
const helpers = require('./helpers')
const path = require('path');

const util =require('util')
const decoder = new stringDecoder('utf-8');

/*
	BELOW -> instead of console.log
	name that is passed as a startup arguement
	used when starting app & seeing only debug messages in the console via
	NODE_DEBUG=server node index.js

	THIS also makes logging in the server terminal
	 CONDITIONAL based on the startup command
	NODE_DEBUG=server node index.js
*/
const debug = util.debuglog('server')


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
	'': routeHandlers.doIndex,
	'api/users': routeHandlers.users,
	'api/tokens' : routeHandlers.tokens,
	'api/menuItems' : routeHandlers.menuItems,
	'api/cart' : routeHandlers.cart,
	'api/charge': routeHandlers.charge,
	'account/create': routeHandlers.accountCreate,
	'account/edit': routeHandlers.accountEdit,
	'menu': routeHandlers.menu,
	'cart': routeHandlers.cartView,
	// 'checkout': routeHandlers.checkout,
	"session/create" : routeHandlers.sessionCreate,
  "session/deleted" : routeHandlers.sessionDeleted,
 'favicon.ico': routeHandlers.favicon,
 'public': routeHandlers.public,
	'notFound' : function(data, callback){ callback(404) }
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

	//as new data comes in, it gets added to this var
	let curIncomingString = ''

	//when request objects emits event data, pass the data to a callback
	//append the new incoming data to the curIncomingString with the decoder
	req.on('data', data => {
		debug('\x1b[32m%s\x1b[0m',`incoming request data ->${data}`)
		curIncomingString += decoder.write(data)
	})

	//when request object emits the end event
	//end the decoder...
	req.on('end', () => {

		curIncomingString += decoder.end();
		
		//choose the handler this request should go to
		let chosenHandler = typeof(serverObj.myRouter[trimmedPathTxt]) !== 'undefined' ? serverObj.myRouter[trimmedPathTxt] : routeHandlers.notFound;
		
		chosenHandler = trimmedPathTxt.indexOf('public') > -1 ? routeHandlers.public : chosenHandler;

		debug('\x1b[32m%s\x1b[0m', `handling ${chosenHandler}`)
		// object to send to the handler
		//PARSING the paload data with helpers method
		let dataToReturn = {
			trimmedPath: trimmedPathTxt,
			queryStrObj: queryString,
			method: reqMethod,
			headers: hdrs,
			payload: helpers.parseJsonToObject(curIncomingString)
		}

		chosenHandler(dataToReturn, (statusCode, payload, contentType) => {


			let payloadStr = ''

			//defaults if none given
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
			//make type-of-response
			contentType = typeof(contentType) == 'string' ? contentType : 'json';

			//json response types (api)
			if(contentType == 'json'){
				res.setHeader('Content-Type', 'application/json');
				payload = typeof(payload) === 'object' ? payload : {};
				payloadStr = JSON.stringify(payload);
			}

			//html response types (html)
			if(contentType == 'html'){
				res.setHeader('Content-Type', 'text/html');
				payloadStr = typeof(payload) == 'string' ? payload : '';
			}	

			if(contentType == 'favicon'){
				res.setHeader('Content-Type', 'image/x-icon');
				payloadStr = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'css'){
				res.setHeader('Content-Type', 'text/css');
				payloadStr = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'png'){
				res.setHeader('Content-Type', 'image/png');
				payloadStr = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'jpg'){
				res.setHeader('Content-Type', 'image/jpeg');
				payloadStr = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'plain'){
				res.setHeader('Content-Type', 'text/plain');
				payloadStr = typeof(payload) !== 'undefined' ? payload : '';
			}

			//log some details
			//response, request method & path
			if(statusCode == 200){
				debug('server 200 response! reqMethod & payloadStr')
				debug('\x1b[32m%s\x1b[0m',`PATH: ${trimmedPathTxt.toUpperCase()}`)
				debug('\x1b[32m%s\x1b[0m',`METHOD: ${reqMethod.toUpperCase()}`)
			}
			else{
				debug('server NON-200 response! reqMethod & payloadStr')
				debug('\x1b[31m%s\x1b[0m',`PATH: ${trimmedPathTxt.toUpperCase()}`)
				debug('\x1b[31m%s\x1b[0m',`METHOD: ${reqMethod.toUpperCase()}`)
			}

			//prepare response
			//writeHead comes on a response object, writitng the status code to the head
			res.writeHead(statusCode);
			res.end(payloadStr);

		})

	})

}

//initialize server script
serverObj.init = () => {

	//Start the httpServer, listen on port 3000
	serverObj.httpServer.listen(envConfig.httpPort, () => {
		
		//send to console in baby-blue!
		console.log(`\x1b[36m%s\x1b[0m`,`HTTP Server is listening on port ${envConfig.httpPort} in environment ${envConfig.friendlyEnvName} mode!!`);
	})

	//Start the httpsServer, listen on port 3001
	serverObj.httpsServer.listen(envConfig.httpsPort, () => {
		
		//send to console in fgWhite, bgBlue
		console.log(`\x1b[44m\x1b[37m%s\x1b[0m`,`HTTPS Server is listening on port ${envConfig.httpsPort} in environment ${envConfig.friendlyEnvName} mode!!`);
	})
}


module.exports = serverObj;