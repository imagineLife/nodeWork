/*
MAKING ENVIRONMENTS:
this stores config vars to start the app in different ways for different envs

GOAL is to start with NODE_ENV=anEnvironment index.js
making staging & productio nenvironmens
staging will be default

NODE_ENV works automagically, its a reguarly practiced convention

*/


//Export Config vars


//container for environments
let envs = {};


//staging environment
envs.staging = {
	httpPort: 3000,
	httpsPort: 3001,
	friendlyEnvName: 'staging',
	hashingSecret: 'thisIsASecret',
	'maxChecks': 5
};

//production environment
envs.prod = {
	httpPort: 5000,
	httpsPort: 5001,
	friendlyEnvName: 'production',
	hashingSecret: 'thisIsASecret',
	'maxChecks': 5
};

//Determines which env to export 
//	by processing which was passed as a cmd line arg
let requestedEnv = typeof(process.env.NODE_ENV ) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


//check that requested env is available from above
//	default to staging
let envToExport = typeof(envs[requestedEnv]) == 'object' ? envs[requestedEnv] : envs.staging;


module.exports = envToExport;