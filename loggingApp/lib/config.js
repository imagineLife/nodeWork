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
	'maxChecks': 5,
	twilioVars: {
		'accountSid': 'ACb32d411ad7fe886aac54c665d25e5c5d',
		'authToken': '9455e3eb3109edc12e3d8c92768f7a67',
		// 'accountSid': 'AC8d757a49924f3eada82b3f1f6086115f',
		// 'authToken': '65f5746112109e2011ec4b0c4de636ea',
		'fromPhoneNumber': '+15005550006'	
	}
};

//production environment
envs.prod = {
	httpPort: 5000,
	httpsPort: 5001,
	friendlyEnvName: 'production',
	hashingSecret: 'thisIsASecret',
	'maxChecks': 5,
	twilioVars: {
		'accountSid': 'ACb32d411ad7fe886aac54c665d25e5c5d',
		'authToken': '9455e3eb3109edc12e3d8c92768f7a67',
		// 'accountSid': 'AC8d757a49924f3eada82b3f1f6086115f',
		// 'authToken': '65f5746112109e2011ec4b0c4de636ea',
		'fromPhoneNumber': '+15005550006'
	}
};

//Determines which env to export 
//	by processing which was passed as a cmd line arg
let requestedEnv = typeof(process.env.NODE_ENV ) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


//check that requested env is available from above
//	default to staging
let envToExport = typeof(envs[requestedEnv]) == 'object' ? envs[requestedEnv] : envs.staging;


module.exports = envToExport;