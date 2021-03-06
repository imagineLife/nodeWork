/*
	Library of 'helpers' for tasks...
	password-hashing
*/


//Dependencies
const crypto = require('crypto');
const config = require('./config')

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
	console.log('parsing string')
	console.log(str)
	try{
		let thisObj = JSON.parse(str);
		return thisObj;
	}catch(e){
		return {}
	}
}

module.exports = helpers;






