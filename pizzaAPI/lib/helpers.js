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


module.exports = helpers;






