/*
MAKING ENVIRONMENTS:
this stores config vars to start the app in different ways for different envs

GOAL is to start with NODE_ENV=anEnvironment index.js
making staging & productio nenvironmens
staging will be default

NODE_ENV works automagically, its a reguarly practiced convention

index requires this, & uses this config


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
	friendlyEnvName: 'prod'

};