/*
	Library of 'helpers' for tasks...
	password-hashing
*/


//Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const queryString = require('querystring');

//container of helpers
let helpers  = {};

//HASH PASSWORD takes a string
//we are using SHA256 as the hash algorithm
//using crypto library that comes with node
// https://nodejs.org/api/crypto.html#crypto_crypto

helpers.hash = function(str){
	if(!(typeof(str) == 'string' && str.length > 0)){
		return false
	}
		
	//uses a hashingSecret!! from dependency config  file
	let hashed = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
	return hashed;
}


helpers.isString = (str) => typeof str === 'string' && str.length > 0; 
helpers.isLength = (itm, l) => itm.length === l;

//parses a json STRING to an object in all cases without throwing erro
helpers.parseJsonToObject = function(str){
	console.log('parsing str')
	console.log(str)
	try{
		const thisObj = JSON.parse(str);
		return thisObj;
	}catch(e){
		console.log('ERROR parsing to str')
		console.log(e)
		return {}
	}
}

//create a str of RANDOM alphaNum chars of a length param
helpers.createRandomString = (strLength) => {
	strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;

	if(!strLength){
		return false
	}

	//define all POSSIBLE cars that COULD go into str
	const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

	//start the rndm str
	let str = '';

	//make the str
	for(let i = 1; i < strLength; i++){
		//get random char
		const rndmChr =  possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))

		//append char to str
		str += rndmChr;
	}

	return str
}


//send SMS via Twilio
helpers.sendTwilioSms = (phoneNumber, sendingMsg, callback) => {


	//validate params
	phoneNumber = typeof(phoneNumber) == 'string' && phoneNumber.trim().length == 10? phoneNumber.trim() : false;
	sendingMsg = typeof(sendingMsg) == 'string' && sendingMsg.trim().length > 0 && sendingMsg.trim().length < 1600 ? sendingMsg.trim() : false;

	if(!phoneNumber || !sendingMsg){
		return callback('given twilio arams were missing OR invalid');
	}

	//config request object for Twilio
	let reqObj = {
		'From': config.twilioVars.fromPhoneNumber,
		'To': `+1${phoneNumber}`,
		'Body': sendingMsg
	}

	//stringify the reqObj
	let strReqOj = queryString.stringify(reqObj)

	//config request details
	let reqDetails = {
		'protocol': 'https:',
		'hostname': 'api.twilio.com',
		'method': 'POST',
		'path': `/2010-04-01/Accounts/${config.twilioVars.accountSid}/Messages.json`,
		'auth': `${config.twilioVars.accountSid}:${config.twilioVars.authToken}`,
		'headers':{
			'Content-Type':'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(strReqOj)
		}
	}

	//instantiate a req obj
	let reqObjMethod = https.request(reqDetails, (res) => {

		//grab status of the request
		let resStatus = res.statusCode;

		//callback the success
		if(!(resStatus == 200 || resStatus == 201)){
			return callback('Status code returned was '+resStatus);
		}
		return callback(false)
	});

	//Bind to the error event SO the error does not get thrown
	reqObjMethod.on('error', err => {
		return callback(e)
	})

	//add request obj to request
	reqObjMethod.write(strReqOj)

	//end request
	reqObjMethod.end();
}


module.exports = helpers;






