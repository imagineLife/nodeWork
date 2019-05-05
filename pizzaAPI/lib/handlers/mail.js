const doUsers = require('./lib/handlers/users')
const https = require('https');
const querystring = require("querystring");

//mailgun sending docs
//	https://documentation.mailgun.com/en/latest/api-sending.html#sending
// post /<domain>/messages

//mailgun sending examples
// https://documentation.mailgun.com/en/latest/api-sending.html#examples

const doMail = {};

doMail.send = (mailType, mailObj, callback) => {
	console.log('mailType')
	console.log(mailType)
	console.log('mailObj')
	console.log(mailObj)
	
	let stringObject = querystring.stringify(mailObj)
	
	let reqOptions = {
		hostname: process.env.MAILGUN_HOST,
        port: process.env.MAILGUN_PORT,
        protocol: "https:",
        path: `/v3/${process.env.MAILGUN_DOMAIN}/messages`,
        method: "POST",
        retry: 1,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(stringObject)
        },
        auth: "api:" + process.env.MAILGUN_API_KEY,
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

	/*
		return new Promise(async function(resolve, reject) {
	        try {
	            await helpers.request(reqOptions, reqData);
	        } catch (error) {
	            reject("Could not send the user a receipt");
	            return;
	        }

	        resolve("Emailed receipt to customer");
	    });

	*/


}