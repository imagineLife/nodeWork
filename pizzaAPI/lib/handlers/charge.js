//Dependencies
const doTokens = require('./tokens')
const dataLib = require('../data')
const helpers = require('../helpers')
const doUsers = require('./users')
const doMail = require('./mail')
const queryString = require('querystring');
const https = require('https');
const u = require('util')
const debug = u.debuglog('CHARGE')

//holder of charge methods
let charge = {}

/*charge POST
REQ FIELDS: 
	token in header
	email in payload
OPT field
	stripeID in body
*/

charge.post = function(data,callback){
	debug('\x1b[32m\x1b[37m%s\x1b[0m','Post Data:')
	debug(data);

	//Prepare stripe communication details
	let stripeAPIPrepData = {
		path: `/v1/customers`,
		method: 'GET'
	}

	//log the DURATION of this charge post method
	console.time('charge POST')

	charge.callback = callback;
	
	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;
	
	if(!passedToken){
		callback(400, { Error: "Missing token" });
        return;
	}

	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, data.payload.email, (tokenIsValid) => {

		if(!tokenIsValid){
			callback(400, { Error: "non-matching token for this user" });
			return;
		}

		//prep holder for stripe customer data
		let stripeCustomerDataObj = {
			id: null,
			source: null,
			cartTotal: null
		}

		//prep holder for cart data;
		let userCartData = null;

		//get node-stored user CART data
		dataLib.read('cart', data.payload.email, (err, cartData) => {

			if(!cartData || cartData == undefined){
				callback(400, {'Error': 'No Cart for a user with this token'})
				return;
			}
			
			//calculate cart total
			let thisCartTotal = cartData.cartData.reduce((acc, curVal) => {
				return acc + (curVal.price * curVal.count) 
			}, 0)

			stripeCustomerDataObj.cartTotal = thisCartTotal * 100
			stripeCustomerDataObj.email = data.payload.email

			userCartData = cartData
			
			/* 
				interact with STRIPE API
				- customer lookup
				- customer creation
				- customer charging
			*/

		    const emailStr = queryString.stringify({email: data.payload.email});

			//check for stripe customer		
			try{
				
				let existingStripeID = data.payload.stripeID || null

				//if stripeID in payload
				if(existingStripeID !== null){
				
					thisCust = {id: existingStripeID}
					charge.proceedWithStripeUser(thisCust, stripeCustomerDataObj, stripeAPIPrepData)
				
				//Create New Stripe User
				}else{
					stripeAPIPrepData.method = "POST";

				    try {
				    	
				        charge.makeStripeReq(stripeAPIPrepData, emailStr).then(customerObj => {
				        	
				        	stripeCustomerDataObj.id = customerObj.id;

				        	// store the stripe user ID in node user data
				        	doUsers.patch({email: data.payload.email, stripeID: customerObj.id}, (patchedData) => {return})
				        	charge.proceedWithStripeUser(customerObj, stripeCustomerDataObj, stripeAPIPrepData)

				        });
				    } catch (error) {
				       charge.callback(400, { Error: "Could not create a new customer" });
				       return;
				    }
				} 

			}catch(e){   	
	            callback(400, { Error: "No Customer present" });
	            return;
			}

		})
	})
}

//prepare stripe communication object
charge.prepRequestObj = (pathMethod) => {
	
	return {
        host: process.env.STRIPE_API_HOST,
        path: pathMethod.path,
        method: pathMethod.method,
        headers: {
            Authorization: `Bearer ${process.env.STRIPE_API_TOKEN}`,
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
}

//send to stripe
charge.makeStripeReq = (reqObj, reqStr) => {

	let stripeAPIResultData = null;
	return new Promise(async function(resolve, reject) {

        try {
            stripeAPIResultData = await helpers.request(charge.prepRequestObj(reqObj), reqStr);
        } catch (error) {
        	console.log('error')
        	console.log(error)
            reject("Error calling to Stripe");
        }
        resolve(stripeAPIResultData);
    });
}

charge.proceedWithStripeUser = (res, stripeCustDataObj, stripeAPIPrepData) => {
	
    stripeCustDataObj.id = res.id;
	stripeCustDataObj.source = (res.sources && res.sources.data && res.sources.data.length > 0 ) ? res.sources.data[0] : null

	//IF NO SOURCE
	//	 make a source
	//	 charge the customer
	if(stripeCustDataObj.source == null){


        stripeAPIPrepData = {
            path: `/v1/customers/${stripeCustDataObj.id}/sources`,
            method: "POST"
        };

        let sourceString = queryString.stringify({source: "tok_visa"})

		//post a source for this customer
		charge.makeStripeReq(stripeAPIPrepData, sourceString).then(stripeSource => {
			
			stripeCustDataObj.source = stripeSource
			charge.chargeStripeCustomer(stripeAPIPrepData, stripeCustDataObj)

		})
	}


	//if stripe source IS present
	//	 charge the customer
	if(stripeCustDataObj.source !== null) {
		charge.chargeStripeCustomer(stripeAPIPrepData, stripeCustDataObj);

		//get firstName from user data
	}
}

charge.prepChargeReqStr = (data) => {
	let obj =  {
		amount: data.cartTotal,
		currency: "usd",
		customer: data.source.customer,
		description: "Ordering pizza"
	}

	return queryString.stringify(obj);
}

charge.chargeStripeCustomer  = (stripeAPIPrepData, stripeCustDataObj) => {
	stripeAPIPrepData = {
		path: "/v1/charges",
		method: "POST"
	};

	let dataInString = charge.prepChargeReqStr(stripeCustDataObj);

	try {		
		
        charge.makeStripeReq(stripeAPIPrepData, dataInString).then(res => {
        	
        	let mailObj = {
        		from: `ImagineLife Pizza Shop <jake@sandboxc9915d1dd51b4d29a578edad903f20ea.mailgun.org>`,
        		to: 'mretfaster@gmail.com',
        		subject: 'Receipt for pizza order',
        		text: `Thanks for your order of $${(stripeCustDataObj.cartTotal/100).toFixed(2)}`
        	}

        	doMail.send(mailObj).then(mailRes => {
        		charge.callback(200, { Success: "email sent! :) " });
        	}).catch(mailErr => {
        		console.log(mailErr)
        		charge.callback(400, {'MailErr': mailErr})
        	})
        })
        .catch(err => {
        	console.log('chargeStripeCustomer err')
        	console.log(err)
        	
        	charge.callback(400, { Error: "Error charging" });	
        });
    } catch (error) {
        charge.callback(400, { Error: "Could not charge" });
        return;
    }
}

module.exports = charge;