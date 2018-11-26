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

let workersObj = {};

//lookup all checks, get their data, send to a validator
workersObj.gatherAllChecks = () => {

	//get a lits of all the checks
	dataLib.listFiles('checks', (err, files) => {
		
		if(!err && files && files.length > 0){
			
			files.forEach(file => {

				//Read in the check-file-data
				//Called originalCheckData because originalCheckData will be changed
				dataLib.read('checks', file, (err, originalCheckData) => {

					if(!err && originalCheckData){

						//pass the data to the check-Validator
						//check-validator continues or logs errors
						workersObj.validateCheckData(originalCheckData)

					}else{
						console.log('error reading one of the checks data...')
					}

				})
			})

		}else{
			//log because this is a BG worker, not a typical call & response
			console.log('couldnt find any checks!!')
		}
	})
}

//Sanity-checking the check data
workersObj.validateCheckData = (origChData) => {
	//is an object
	origChData = typeof(origChData) == 'object' && origChData !== null ? origChData : {};
	
	//checks ID
	origChData.id == typeof(origChData) == 'string' && origChData.id.trim().length == 19 ? origChData.id.trim() : false;

	//checks phone
	origChData.userPhone == typeof(origChData.userPhone) == 'string' && origChData.userPhone.trim().length == 10 ? origChData.userPhone.trim() : false;

	//checks protocol
	origChData.protocol == typeof(origChData.protocol) == 'string' && ['http', 'https'].indexOf(origChData.protocol) > -1 ? origChData.protocol : false;

	//checks url
	origChData.url == typeof(origChData.url) == 'string' && origChData.url.trim().length > 0 ? origChData.url.trim() : false;

	//checks method
	origChData.method == typeof(origChData.method) == 'string' && ['post','get','put','delete'].indexOf(origChData.method) > -1 ? origChData.method : false;

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

	//if all checks pass, continue
	if(origChData.id
		&& origChData.userPhone 
		&& origChData.protocol
		&& origChData.url
		&& origChData.method
		&& origChData.successCodes
		&& origChData.timeoutSeconds
	){
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

//perform the check
//send the originalCheckData
//send the outcome of the check-process to the next step
workersObj.performCheck = (originalCheckData) => {

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

	let hostName = parsedUrl.hostname;

	//using PATH not PATH NAME because we want the query string from the path
	let path = parsedUrl.path;

	//construyct the reqObj
	let reqObj = {
		'protocol': `${originalCheckData.protocol}:`,
		'hostname': hostName,
		'method': originalCheckData.method.toUpperCase(),
		'path': path,
		'timeout': originalCheckData.timeoutSeconds * 1000
	}

	//get module to use
	let modToUse = originalCheckData.protocol == 'http' ? http : https;

	let finishedReq = modToUse.request(reqObj, function(res){

		//get status of sent obj
		let reqStatus = res.statusCode;

		//update check Outcome and pass data
		checkOutcome.responseCode = reqStatus;

		//pass on to next phase if hasnt been sent
		if(!outcomeSent){
			workersObj.processCheckOutcome(originalCheckData, checkOutcome);
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

	//decide if check is considered up or down
	let upOrDown = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

	//checking if alert should happen
	let alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== upOrDown ? true : false;

	//Prepare to save the check in DB with last check time & new state
	const newCheckData = originalCheckData;
	newCheckData.state = upOrDown;
	newCheckData.lastChecked = Date.now();

	//SAVE the new data
	dataLib.update('checks', newCheckData.id, newCheckData, (err) => {
		if(!err){

			//SEnd the new check data along 
			if(alertWarranted){

				workersObj.alertUserToCheckStatusChange(newCheckData)
			
			}else{
				console.log('Check outcome has NOT changed, not alert needed')
			}

		}else{
			console.log('ERROR Trying to save updates to one of the checks...')
			console.log(newCheckData)
			console.log('- - - - -')
		}
	})
}

//Timer, executing the worker-process once per minute
workersObj.startLoop = () => {
	setInterval(() => {
		workersObj.gatherAllChecks();
	},(1000 * 60)) //once-per-minute
}

//init script
workersObj.init = () => {
	
	//Execute all the CHECKS
	workersObj.gatherAllChecks();

	//Call a loop so that the checks continue on their own
	workersObj.startLoop();

}

//Alert the user to a change in their check status
workersObj.alertUserToCheckStatusChange = (checkData) => {

	const alertMsg = `ALERT: your check for ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} is currently ${checkData.state}`
	helpersLib.sendTwilioSms(checkData.userPhone, alertMsg, (err, callback) => {
		if(!err){
			console.log(`SUCCESS!! User was alerted to a status change in their check via SMS!`)
			console.log(alertMsg)
		}else{
			console.log('ERROR sending sms to user who had a state change in their check')
			console.log('checkData')
			console.log(checkData)
			console.log('- - - - -')
		}
	})
}

//export the workersObj
module.exports = workersObj;