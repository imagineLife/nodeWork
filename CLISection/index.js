//PRIMARY file for the server api

const server = require('./lib/server')
const webWorkers = require('./lib/workers')
const cli = require('./lib/cli')

let appObj = {};

//init function
//calls server & workers file
appObj.init = () => {

	//start server
	server.init();

	//start webWorkers
	webWorkers.init();

	//WORKAROUND-ISH: 
	//start the CLI AFTER the other items
	setTimeout(() => {
		cli.init();
	}, 100)

}

//Executes init fn
appObj.init();

//exports app for testing later on
module.exports = appObj;