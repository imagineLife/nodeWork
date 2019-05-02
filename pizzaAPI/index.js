//PRIMARY file for the api
const server = require('./lib/server')
const webWorkers = require('./lib/workers')
const envs = require('./env.js')

let serverObj = {};

//init function
//starts server & webWorkers
serverObj.init = () => {

	//start server
	server.init();

	//start webWorkers
	// webWorkers.init();

	console.log('process.env')
	console.log(process.env)
	
	/*
		START app with cli_env=prod or cli_env=dev node index.js

		(failover) cont env = process.env.cli_env || 'dev'
		
		require env above
			export json obj
			then read the file
			get env vars
			for(var thisEnv in envVars) => {
				process.env[thisEnv] = envVars[process.env[env]].thisEnv
			}
	*/
	
}

//Executes init fn
serverObj.init();

//exports app for testing later on
module.exports = serverObj;