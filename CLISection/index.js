//PRIMARY file for the server api

const server = require('./lib/server')
const webWorkers = require('./lib/workers')

let appObj = {};

//init function
//calls server & workers file
appObj.init = () => {

	//start server
	server.init();

	//start webWorkers
	// webWorkers.init();

}

//Executes init fn
appObj.init();

//exports app for testing later on
module.exports = appObj;