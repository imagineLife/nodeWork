//PRIMARY file for the server api

const server = require('./lib/server')
const webWorkers = require('./lib/workers')

let appObj = {};

//init function
//calls server & workers file
app.init = () => {

	//start server
	server.init();

	//start webWorkers
	webWorkers.init();

}

//Executes init fn
app.init();

//exports app for testing later on
module.exports = appObj;