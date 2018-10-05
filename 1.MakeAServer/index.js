//Dependency
const http = require('http')
const port = 3000

//the server should respond to all requests with a string
//create server obj
const server = http.createServer((req, res) => {

	//send the string back
	res.end('basic node server response string\n');

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
