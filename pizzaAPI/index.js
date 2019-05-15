//PRIMARY file for the api
const server = require('./lib/server')

const envVars = require('./env.js')

//START APP with cli_env=prod or cli_env=dev node index.js
//	will 'default' to cli_env=dev below

let serverObj = {};

//init function
//starts server
serverObj.init = () => {

	//start server
	server.init();

	//get/set env vars from env file
	const envType = process.env.cli_env || 'dev'
	for(var thisEnv in envVars[envType]){
		process.env[thisEnv] = envVars[envType][thisEnv]
	}
	
}

//Executes init fn
serverObj.init();

//exports app for testing later on
module.exports = serverObj;