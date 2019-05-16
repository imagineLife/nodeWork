const doUsers = require('./users')
const https = require('https');
const querystring = require("querystring");
const helpers = require('../helpers.js')
const u = require('util')
const debug = u.debuglog('MAIL')

//mailgun sending docs
//	https://documentation.mailgun.com/en/latest/api-sending.html#sending
// post /<domain>/messages

//mailgun examples
// https://documentation.mailgun.com/en/latest/api-sending.html#examples

const doMail = {};

doMail.send = mailObj => {
    debug(`\x1b[36m%s\x1b[0m`,`SEND:`);
    debug(`\x1b[36m%s\x1b[0m`, mailObj);
    debug(`\x1b[36m%s\x1b[0m`, mailType);

	
	let stringObject = querystring.stringify(mailObj)
	
	let apiStr = `api:${process.env.MAILGUN_API_KEY}`
	let reqOptions = {
        host: `api.mailgun.net`,//`${process.env.MAILGUN_API_HOST}`,
        path: `/v3/${process.env.MAILGUN_API_DOMAIN}/messages`,
        method: "POST",
        headers: {
        	"Authorization" : `Basic ${helpers.btoa(apiStr)}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
	};
	
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