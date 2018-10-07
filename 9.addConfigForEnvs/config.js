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

	port: 3000,
	friendlyEnvName: 'staging'

};

//production environment
envs.prod = {

	port: 5000,
	friendlyEnvName: 'production'

};

//Determines which env to export 
//	by processing which was passed as a cmd line arg
let requestedEnv = typeof(process.env.NODE_ENV ) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


//check that requested env is available from above
//	default to staging
let envToExport = typeof(envs[requestedEnv]) == 'object' ? envs[requestedEnv] : envs.staging;


module.exports = envToExport;