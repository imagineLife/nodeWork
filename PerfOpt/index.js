//PRIMARY file for the server api

const server = require('./lib/server')
const webWorkers = require('./lib/workers')
const cli = require('./lib/cli')

let appObj = {};

//init function
//calls server & workers file
appObj.init = function(callback){

	//start server
	server.init();

	//start webWorkers
	webWorkers.init();

	//WORKAROUND-ISH: 
	//start the CLI AFTER the other items
	setTimeout(function(){
		cli.init();
		callback();
	}, 50)

}

/*
	Executes init fn
	ONLY if this file is required directly from cmd line
	-- includes empty callback
*/
if(require.main == module){
	appObj.init(function(){});
}

//exports app for testing later on
module.exports = appObj;