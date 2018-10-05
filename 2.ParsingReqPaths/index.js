//Dependency
const http = require('http');
const port = 3000;
const url = require('url')

const server = http.createServer((req, res) => {

	//get & parse the url
	const parsedUrl = url.parse(req.url, true);

	/*
	console.log(parsedUrl) returns... 
	parsedUrl
	Url {
	  protocol: null,
	  slashes: null,
	  auth: null,
	  host: null,
	  port: null,
	  hostname: null,
	  hash: null,
	  search: '',
	  query: {},
	  pathname: '/',
	  path: '/',
	  href: '/' }


	 the true parameter tells node to call the queryString module.
	 	url calls queryString to give back a parsed url obj
	*/

	//get the 'path' name from the url, trim the pathText
	const pathText = parsedUrl.pathname;
	const trimmedPathTxt = pathText.replace(/^\/+|\/+$/g,'')
	/*
	NOTE: 
		going to this url in the browser returns the path AND the favicon
	*/

	// send the response
	res.end('basic node server response string\n');


	//'log' the request path
	console.log(`request recieved on ${trimmedPathTxt}`)

})

//Start the server, listen on port 3000
server.listen(port, () => console.log(`Server is listening on port ${port}!!`))

/*
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
