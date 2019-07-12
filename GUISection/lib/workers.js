/*

	Web-Worker related tasks

*/

//Dependencies
const path = require('path');
const fs = require('fs');
const dataLib = require('./data');
const https = require('https');
const http = require('http');
const helpersLib = require('./helpers');
const url = require('url');
const logsLib = require('./logs')
const util =require('util')

/*
	BELOW -> instead of console.log
	name that is passed as a startup arguement
	used when starting app & seeing only debug messages in the console via
	NODE_DEBUG=workers node index.js

	THIS also makes logging in the server terminal
	 CONDITIONAL based on the startup command
	NODE_DEBUG=workers node index.js
*/
const debug = util.debuglog('workers')

let workersObj = {};

//Timer to execute log rotation process
//1x per day
workersObj.logRotationLoop = () => {
	setInterval(() => {
		workersObj.rotateLogs();
	},(1000 * 60 * 60 * 24)) //once-per-day
}

//init script
workersObj.init = () => {

	//send to console in YELLOW!
	console.log(`\x1b[33m%s\x1b[0m`,'BG workers are running!');
	
	//Execute all the CHECKS
	workersObj.gatherAllChecks();

	//Call a loop so that the checks continue on their own
	workersObj.startLoop();

	//compress all the logs immediately
	workersObj.rotateLogs();

	//Call the compression loop, compressing every 24 hours
	workersObj.logRotationLoop();

}

//Alert the user to a change in their check status
workersObj.alertUserToCheckStatusChange = (checkData) => {

	const alertMsg = `ALERT: your check for ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} is currently ${checkData.state}`
	helpersLib.sendTwilioSms(checkData.userPhone, alertMsg, (err, callback) => {
		if(!err){
			debug(`SUCCESS!! User was alerted to a status change in their check via SMS!`)
			debug(alertMsg)

		}else{
			debug('ERROR sending sms to user who had a state change in their check')
			debug('checkData')
			debug(checkData)
			debug('- - - - -')
		}
	})
}

//Writes check status to filesystem log file
workersObj.writeToLog = (originalCheckData, checkOutcome,upOrDownStatus,alertWarranted,timeOfCheck) => {

	//form the log data
	const logObj = {
		'checkData': originalCheckData,
		'checkOutcome': checkOutcome,
		'state':upOrDownStatus,
		'alert': alertWarranted,
		'time': timeOfCheck	
	}

	//convert obj to string
	const logStr = JSON.stringify(logObj)

	/*
		DETERMINE the name of the log file
		Different logs for different checks at different times
	*/

	const logFileName = originalCheckData.id;

	// append log string to the log file
	logsLib.append(logFileName, logStr, err => {
		if(!err){
			debug('Logging to the file succeeded!')
		}else{
			debug('LOGGING FAILED')
		}
	})

}

//export the workersObj
module.exports = workersObj;