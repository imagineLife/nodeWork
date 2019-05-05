const doUsers = require('./users')
const https = require('https');
const querystring = require("querystring");
const helpers = require('../helpers.js')

//mailgun sending docs
//	https://documentation.mailgun.com/en/latest/api-sending.html#sending
// post /<domain>/messages

//mailgun sending examples
// https://documentation.mailgun.com/en/latest/api-sending.html#examples

const doMail = {};

doMail.send = (mailType, mailObj, callback) => {
	console.log('SENDING MAIL!');
	console.log('mailType')
	console.log(mailType)
	console.log('mailObj')
	console.log(mailObj)
	
	// console.log('process.env')
	// console.log(process.env)
	
	
	let stringObject = querystring.stringify(mailObj)
	
	let reqOptions = {
        hostname: `${process.env.MAILGUN_API_HOST}`,
        path: `/${process.env.MAILGUN_API_DOMAIN}/messages`,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        auth: `api:${process.env.MAILGUN_API_KEY}`,
        agent: false
	};

	if(mailType == 'receipt'){

	//modeled after...

		//prep headers obj
		// reqOptions = {
		// 	hostname: process.env.MAILGUN_HOST,
	 //        port: process.env.MAILGUN_PORT,
	 //        protocol: "https:",
	 //        path: `/v3/${process.env.MAILGUN_DOMAIN}/messages`,
	 //        method: "POST",
	 //        retry: 1,
	 //        headers: {
	 //            "Content-Type": "application/x-www-form-urlencoded",
	 //            "Content-Length": Buffer.byteLength(reqData)
	 //        },
	 //        auth: "api:" + process.env.MAILGUN_API_KEY,
	 //        agent: false
		// }

	}

	/*
		Other future mail options...
		if(mailType == 'promo')
		if(mailType == 'resetPassword')
		if(mailType == 'confirmEmail')
	*/

	console.log('reqOptions')
	console.log(reqOptions)
	console.log('stringObject')
	console.log(stringObject)

	
	return new Promise(async function(resolve, reject) {
		let mailAPIResults = null;
        try {
            mailAPIResults = await helpers.request(reqOptions, stringObject);
        } catch (error) {
        	console.log(error)
        	reject(` ^ ^ ^ ERROR: Could not send the user a ${mailType}`);
        }
        resolve(mailAPIResults);
    });

	


}

module.exports = doMail;