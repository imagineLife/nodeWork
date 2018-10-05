//Dependency
const http = require('http');
const port = 3000;
const url = require('url')

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
	const hdrs = req.headers

	// send the response
	res.end('basic node server response string\n');

	//'log' the request path
	console.log(`request recieved on ${trimmedPathTxt} with method ${reqMethod} & queryStringParams Next...`)
	console.log(queryString)
	console.log('req headers...')
	console.log(hdrs)

	//test this using postman

})

//Start the server, listen on port 3000
server.listen(port, () => console.log(`Server is listening on port ${port}!!`))

/*
NOTE: 
		going to this url in the BROSWER returns the path AND the favicon

To run
1. cd into this directory
2. node index.js
	3. open new terminal
	4. curl localhost:3000

	OR
	3. open browser
	4. go to localhost:3000

5. when done, control-c the running node server, the first terminal window that ran node index.js

*/
