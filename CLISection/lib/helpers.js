/*
	Library of 'helpers' for tasks...
	password-hashing
*/


//Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const queryString = require('querystring');
const path = require('path')
const fs = require('fs')

//container of helpers
let helpers  = {};

//HASH PASSWORD takes a string
//we are using SHA256 as the hash algorithm
//using crypto library that comes with node
// https://nodejs.org/api/crypto.html#crypto_crypto

helpers.hash = function(str){
	if(typeof(str) == 'string' && str.length > 0){
		
		//uses a hashingSecret!! from dependency config  file
		let hashed = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hashed;

	}else{
		return false
	}
}


//parses a json STRING to an object in all cases without throwing erro
helpers.parseJsonToObject = function(str){
	try{
		const thisObj = JSON.parse(str);
		return thisObj;
	}catch(e){
		return {}
	}
}

//create a str of RANDOM alphaNum chars of a length param
helpers.createRandomString = (strLength) => {
	strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;

	if(strLength){

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

	}else{
		return false
	}
}


//send SMS via Twilio
helpers.sendTwilioSms = (phoneNumber, sendingMsg, callback) => {


	//validate params
	phoneNumber = typeof(phoneNumber) == 'string' && phoneNumber.trim().length == 10? phoneNumber.trim() : false;
	sendingMsg = typeof(sendingMsg) == 'string' && sendingMsg.trim().length > 0 && sendingMsg.trim().length < 1600 ? sendingMsg.trim() : false;

	if(phoneNumber && sendingMsg){

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
			if(resStatus == 200 || resStatus == 201){
				callback(false)
			}else{
				callback('Status code returned was '+resStatus);
			}
		});

		//Bind to the error event SO the error does not get thrown
		reqObjMethod.on('error', err => {
			callback(e)
		})

		//add request obj to request
		reqObjMethod.write(strReqOj)

		//end request
		reqObjMethod.end();

	}else{
		callback('given twilio arams were missing OR invalid');
	}
}

//gets the string content of a template by name
/*
	templateStringName: String
	dataObj: variables to insert into html
		by using in helpers.interpolate()
	cb: Fn 
*/
helpers.getTemplate = (templateStringName, dataObj, cb) => {
	
	//sanity-checking the template string && data
	templateStringName = typeof(templateStringName) == 'string' && templateStringName.length > 0 ? templateStringName : false;
	dataObj = typeof(dataObj) == 'object' && dataObj !== null ? dataObj : {};

	//error-handling
	if(!templateStringName){
		cb('A valid template was not specified')
		return;
	}

	//template directory
	const tempDir = path.join(__dirname, '/../templates/');
	
	//look for the template html file
	fs.readFile(`${tempDir}${templateStringName}.html`, 'utf8', (err, strRes) => {		
		
		//sanity-checking template response
		if(!err && strRes && strRes.length > 0){

			//see helpers.interpolate
			let interpolatedStr = helpers.interpolate(strRes, dataObj)
			
			return cb(false, interpolatedStr)
		}else{
			cb('no template found')
			return;
		}
	})
}


// finds && replaces keys within a string
// using config data
/*
	str: string
	dataObj: object
		contains keys && values that get replaced in the string
*/
helpers.interpolate = (str,dataObj) => {
	
	//'sanity' check
	str = typeof(str) == 'string' && str.length > 0 ? str : ''
	dataObj = typeof(dataObj) == 'object' && dataObj !== null ? dataObj : {}
	
	// add the template globals to the data obj
	for(let keyName in config.globalTemplate){
		if(config.globalTemplate.hasOwnProperty(keyName)){
	
			// prepend the key names with 'global'
			dataObj[`global.${keyName}`] = config.globalTemplate[keyName];
		}
	}
	
	//REPLACE the variables in the html with the variables from dataObj
	for(let keyName in dataObj){
		if(dataObj.hasOwnProperty(keyName) && typeof(dataObj[keyName] == 'string')){
			const replaceVar = dataObj[keyName]
			const findVal = `{${keyName}}`

			//update string
			str = str.replace(findVal, replaceVar)
		}
	}
	
	return str
}

/*
	Wrap the header && footer around the given template string
	str: template string
	data: a configuration  data object for the header && foter
	cb : a callback fn
*/
helpers.addHeaderFooter = (str,dataObj,cb) => {
	
	//sanity Check
	str = typeof(str) == 'string' && str.length > 0 ? str : '';
	dataObj = typeof(dataObj) == 'object' && dataObj !== null ? dataObj : {}

	//get header template
	helpers.getTemplate('_header', dataObj, (err,headerString) => {
		
		//error-handling
		if(err || !headerString){

			cb(`Couldn't find header template`)
			return;
		}

		//get footer template
		helpers.getTemplate('_footer', dataObj, (err,footerString) => {
			
			//error-handling
			if(err || !footerString){

				cb(`Couldn't find footer template`)
				return;
			}

			const wrappedResult = headerString+str+footerString;
			cb(false, wrappedResult)
			return;
		})

	})
}

helpers.getStaticAsset = (fileName, cb) => {
	
	//sanity-check
	fileName = typeof(fileName) == 'string' && fileName.length > -1 ? fileName : false;

	if(!fileName){
		return cb('Valid filename was not specified')
	}

	const publicDir = path.join(__dirname, '/../public/')
	
	//get the assset from the file-system
	fs.readFile(publicDir+fileName, (err, fileData) => {
		
		//error-handling
		if(err !== null || !fileData){
			return cb('no file could be found')
		}

		return cb(false, fileData)
	})

}

module.exports = helpers;