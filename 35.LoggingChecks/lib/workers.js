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
const { isString, isLength } = helpersLib;
const logsLib = require('./logs')

let workersObj = {};

//lookup all checks, get their data, send to a validator - make sure checks are valid
workersObj.gatherAllChecks = () => {

	//get a lits of all the checks
	dataLib.listFiles('checks', (err, files) => {
		
		if(err || !files || !(files.length > 0)){
			//log because this is a BG worker, not a typical call & response
			console.log('couldnt find any checks!!');
			return;
		}

		/*
			Read the check-file-data
			pass the data to the check-Validator
			check-validator continues or logs errors
		*/
		files.forEach(file => {
			dataLib.read('checks', file, (err, originalCheckData) => {
				if(err || !originalCheckData){
					console.log('error reading one of the checks data...')
					return;
				}
				workersObj.validateCheckData(originalCheckData)
			})
		})
	})
}

//Sanity-checking the check data
workersObj.validateCheckData = (origChData) => {
	//is an object
	origChData = typeof(origChData) == 'object' && origChData !== null ? origChData : {};
	
	//checks ID
	origChData.id == isString(origChData.id) && isLength(19) ? origChData.id.trim() : false;

	//checks phone
	origChData.userPhone == isString(origChData.userPhone) && isLength(19) ? origChData.userPhone.trim() : false;

	//checks protocol
	origChData.protocol == isString(origChData.protocol) && ['http', 'https'].indexOf(origChData.protocol) > -1 ? origChData.protocol : false;

	//checks url
	origChData.url == isString(origChData.url) && origChData.url.trim().length > 0 ? origChData.url.trim() : false;

	//checks method
	origChData.method == isString(origChData.method) && ['post','get','put','delete'].indexOf(origChData.method) > -1 ? origChData.method : false;

	//checks successCodes
	origChData.successCodes == typeof(origChData.successCodes) == 'object' && origChData.successCodes instanceof Array && origChData.successCodes.length > 0 ? origChData.successCodes : false;

	//checks timeoutSeconds
	origChData.timeoutSeconds == typeof(origChData.timeoutSeconds) == 'number' && origChData.timeoutSeconds % 1 == 0 && origChData.timeoutSeconds >= 1 && origChData.timeoutSeconds <= 5 ? origChData.timeoutSeconds : false;

	//set new keys (state, lastChecked)
	// that may NOT be set
	// if the workers have never seen this check before

	//default state to DOWN 
	origChData.state == typeof(origChData.state) == 'string' && ['up', 'down'].indexOf(origChData.state) > -1 ? origChData.state : 'down';

	//checks lastChecked
	//default to false if DOWN
	origChData.lastChecked == typeof(origChData.lastChecked) == 'number' && origChData.lastChecked > 0 ? origChData.lastChecked : false;

	//destructure keys
	let { id, userPhone, protocol, url, method, successCodes, timeoutSeconds } = origChData;
	
	//if all checks pass, continue
	if(id && userPhone && protocol && url && method && successCodes && timeoutSeconds ){
		workersObj.performCheck(origChData)
	}else{
		console.log('error, ONE of the checks is not properly formatted...')
		console.log('origChData.id')
		console.log(origChData.id)
		console.log('origChData.userPhone')
		console.log(origChData.userPhone)
		console.log('origChData.protocol')
		console.log(origChData.protocol)
		console.log('origChData.url')
		console.log(origChData.url)
		console.log('origChData.method')
		console.log(origChData.method)
		console.log('origChData.successCodes')
		console.log(origChData.successCodes)
		console.log('origChData.timeoutSeconds')
		console.log(origChData.timeoutSeconds)
	}

}

/* 
	look @ url
	make http(s) req to url
	send the originalCheckData &&
	send the outcome of the check-process 
		to the next step
*/
workersObj.performCheck = (originalCheckData) => {
	// console.log('--Performing Check--');
	// console.log('originalCheckData')
	// console.log(originalCheckData)
	// console.log('// - - - - - //')
	

	//prep initial check outcome
	let checkOutcome = {
		'error': false,
		'responseCode': false
	};

	//mark that the outcome of the checkOutcome
	// has not been sent yet
	let outcomeSent = false;

	//parse host & path out from origCheckData
	//THIS is needed for sending to the twilio API
	let parsedUrl = url.parse(`${originalCheckData.protocol}:${originalCheckData.url}`,true)

	//using PATH not PATH NAME because we want the query string from the path
	let {hostName, path } = parsedUrl;

	//construyct the reqObj to send to the url
	let reqObj = {
		'protocol': `${originalCheckData.protocol}:`,
		'hostname': hostName,
		'method': originalCheckData.method.toUpperCase(),
		'path': path,
		'timeout': originalCheckData.timeoutSeconds * 1000
	}

	//get module to use (http OR https)
	let modToUse = originalCheckData.protocol == 'http' ? http : https;

	let finishedReq = modToUse.request(reqObj, function(res){

		//get status of sent obj
		let reqStatus = res.statusCode;

		//update check Outcome and pass data
		checkOutcome.responseCode = reqStatus;

		//pass on to next phase if hasnt been sent
		if(!outcomeSent){
			workersObj.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}

	})

	//bind to the err event SO THAT the err doesn't get thrown
	finishedReq.on('error', e => {
		console.log('REQUEST ERROR')
		console.log(e)

		//update the checkOutcome & pass data along
		checkOutcome.error = {
			'error': true,
			'value': e
		}

		//pass on to next phase if hasnt been sent
		if(!outcomeSent){
			workersObj.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}
	})

	//bind to timeout event
	finishedReq.on('timeout', e => {

		//update the checkOutcome & pass data along
		checkOutcome.error = {
			'error': true,
			'value': 'timeout surpassed'
		}

		//pass on to next phase if hasnt been sent
		if(!outcomeSent){
			workersObj.processCheckOutcome(originalCheckData, checkOutcome);
		}
	})

	//end & send the request
	finishedReq.end();
}



//takes in checks (may be in error)
//updates checkData as needed
//trigger ALERT to user if needed
//SPECIAL logic for accommodating a check that has not been tested yet
//	DONT want to alert on the first check
workersObj.processCheckOutcome = (originalCheckData, checkOutcome) => {
	console.log('processCheckOutcome checkOutcome')
	console.log(checkOutcome)
	console.log('* * * * * ')

	/*
		decide if check is considered up or down
		UP if no err && successCode is as expected
	*/
	let upOrDown = !checkOutcome.error && 
		checkOutcome.responseCode && 
		originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ?
		'up' : 'down';

	//alert if IS last-checked AND check state has changed from previous check-state
	let alertWarranted = originalCheckData.lastChecked 
		&& originalCheckData.state !== upOrDown 
		? true : false;

	//Prepare to save the check in DB with last check time & new state
	const newCheckData = originalCheckData;
	newCheckData.state = upOrDown;
	newCheckData.lastChecked = Date.now();

	//write activity to a log file
	workersObj.logToFile(originalCheckData, checkOutcome, upOrDown,alertWarranted, newCheckData.lastChecked)
	
	//SAVE the new data
	dataLib.update('checks', newCheckData.id, newCheckData, (err) => {
		if(err){
			console.log('ERROR Trying to save updates to one of the checks...')
			console.log(newCheckData)
			console.log('- - - - -')
			return;
		}

		//SEnd the new check data along 
		if(!alertWarranted){
			console.log('Check outcome has NOT changed, not alert needed')
			return;
		}

		workersObj.alertUserToCheckStatusChange(newCheckData)
	})
}

// Log to a file
workersObj.logToFile = function(originalCheckData, checkOutcome, upOrDown, alertWarranted, lastChecked){
	
	//put params in an obj
	const logDataObj = {
		checkData: originalCheckData, 
		checkOutcome,
		upOrDown,
		alertWarranted, 
		lastChecked
	}

	//convert to string
	const logString = JSON.stringify(logDataObj)

	//get NAME of log file FROM check Data, the ID of the check
	const logFileName = originalCheckData.id

	//append the logString to the file
	logsLib.append(logFileName,logString, (err)=> {
		if(err){
			return console.log('Logging-to-file FAILED')
		}

		return console.log('Logging-to-file SUCCEEDED!!')
	})
}

//Timer, executing the worker-process once per minute
workersObj.startLoop = () => {
	setInterval(() => {
		workersObj.gatherAllChecks();
	},(1000 * 10)) //1 log every 10
}

workersObj.rotateLogs = function(){

	//list logs in log dir
	logsLib.listLogs(false, (err, logList) => {
		if(err || !logList){
			return console.log('ERROR: no logs to rotate')
		}

		logList.forEach(function(singleLogFile){

			//clean-up logID
			const logID = singleLogFile.replace('.log', '');

			//make NEW log file name, including date
			const newFileID = `${logID}-${Date.now()}`

			logsLib.compress(logID, newFileID, (err) => {
				if(err){
					console.log('ERROR compressing one of the log files:');
					return console.log(err);
				}
				
				logsLib.truncate(logID, err => {
					if(err){
						return console.log('ERROR truncating a log file')
					}

					console.log('SUCCESS truncating a log file!')
				})

			})
		})

	})

}

//TIMER to execute the log-rotation process,
// runs 'daily'
workersObj.initRotateLogLoop = function(){
	setInterval(function(){
		workersObj.rotateLogs()
	}, 100 * 60 * 60 * 24)
}

//init script
workersObj.init = () => {
	
	//Execute all the CHECKS
	workersObj.gatherAllChecks();

	//Call a loop so that the checks continue on their own
	workersObj.startLoop();

	// Compress All logs immediately
	workersObj.rotateLogs()

	// Call a compression LOOP to compress logs later on
	workersObj.initRotateLogLoop()

}

//Alert the user to a change in their check status
workersObj.alertUserToCheckStatusChange = (checkData) => {

	const alertMsg = `ALERT: your check for ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} is currently ${checkData.state}`
	helpersLib.sendTwilioSms(checkData.userPhone, alertMsg, (err, callback) => {
		if(err){
			console.log('ERROR sending sms to user who had a state change in their check')
			console.log('checkData')
			console.log(checkData)
			console.log('- - - - -')
			return;
		}

		console.log(`SUCCESS!! User was alerted to a status change in their check via SMS!`)
		console.log(alertMsg)
		return;
	
	})
}

//export the workersObj
module.exports = workersObj;