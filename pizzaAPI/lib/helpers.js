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
		/*
			NOTE: a JWT can be built using node too!!
			jwt encodes the user ID, token, expirationdate, guid
		*/
		let hashed = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hashed;

	}else{
		return false
	}
}

helpers.isString = (str) => typeof str === 'string' && str.length > 0; 
helpers.isLength = (itm, l) => itm.length === l;

//parses a json STRING to an object in all cases without throwing erro
helpers.parseJsonToObject = function(str){	
	try{
		return JSON.parse(str);
	}catch(e){
		return {'error':'nothing to do here'}
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

//Send a request to Stripe ... OR Mailgun
helpers.request = function(reqOptions, reqData) {
	
    return new Promise((resolve, reject) => {
        const req = https.request(reqOptions, res => {
            let responseData;
            res.setEncoding("utf-8");

            res.on("data", chunk => {
                responseData = chunk;
            });

            res.on("end", () => {
                try {                	
                    resolve(JSON.parse(responseData));
                } catch (e) {
                    resolve({'Request error': responseData});
                }
            });
        });

        req.on("error", e => {
            reject({ Error: `There was an error sending the request ${e}` });
        });
        req.write(reqData);
        req.end();
    });
};

helpers.btoa = function btoa(str) {
	let buffer;

	if (str instanceof Buffer) {
	  buffer = str;
	} else {
	  buffer = Buffer.from(str.toString(), 'binary');
	}

	return buffer.toString('base64');
};

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
		if(err || !strRes || !(strRes.length > 0)){
			return cb('no template found');
		}

		//see helpers.interpolate
		let interpolatedStr = helpers.interpolate(strRes, dataObj)
		
		return cb(false, interpolatedStr)
	})
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






