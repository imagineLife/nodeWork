//PRIMARY file for the api
const server = require('./lib/server')
const webWorkers = require('./lib/workers')

let serverObj = {};

//init function
//starts server & webWorkers
serverObj.init = () => {

	//start server
	server.init();

	//start webWorkers
	// webWorkers.init();

}

//Executes init fn
serverObj.init();

//exports app for testing later on
module.exports = serverObj;