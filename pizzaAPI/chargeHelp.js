//Dependencies
const doTokens = require('./lib/handlers/tokens.js')
const dataLib = require('./lib/data.js')
const helpers = require('./lib/helpers.js')
const doUsers = require('./lib/handlers/users')
const queryString = require('querystring');
// const {STRIPE_API_HOST, STRIPE_API_TOKEN} = require('./env.js')
const https = require('https');

//holder of charge methods
let charge = {}

//charge POST
//REQ FIELDS: 
//	token in header
//	email in payload

charge.post = function(data,callback){

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
		console.timeEnd('charge POST')
		callback(400, { Error: "Missing token" });
        return;
	}

	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, data.payload.email, (tokenIsValid) => {

		if(!tokenIsValid){
			console.timeEnd('charge POST')
			callback(400, { Error: "non-matching token for this user" });
			return;
		}

		//prep holder for stripe customer data
		let stripeCustomerDataObj = {
			id: null,
			source: null,
			cartTotal: null
		}

		//get node-stored user CART data
		dataLib.read('cart', data.payload.email, (err, cartData) => {

			if(!cartData || cartData == undefined){
				console.timeEnd('charge POST')
				callback(400, {'Error': 'No Cart for a user with this token'})
				return;
			}
			
			//calculate cart total
			let thisCartTotal = cartData.cartData.reduce((acc, curVal) => {
				return acc + (curVal.price * curVal.count) 
			}, 0)

			stripeCustomerDataObj.cartTotal = thisCartTotal * 100

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
				        	doUsers.patch({email: data.payload.email, stripeID: customerObj.id}, (patchedData) => return)
				        	charge.proceedWithStripeUser(customerObj, stripeCustomerDataObj, stripeAPIPrepData)

				        });
				    } catch (error) {
				    	console.log('TRIED to make stripe user, error')
				    	console.log(error)
				    	console.timeEnd('charge POST')
				       charge.callback(400, { Error: "Could not create a new customer" });
				       return;
				    }
				} 

			}catch(e){
				console.log('error charging :(')
	        	console.log(e)	        	
	        	console.timeEnd('charge POST')
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
            "Content-Type": "application/x-www-form-urlencoded",
            //can help prevent against ddos attacks...
            // "Content-Length": Buffer.byteLength(reqStr)
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
	
	/*

		NEEDS UPDATING, when there IS a customer
		returns a SOURCES object

	*/	
	
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

charge.chargeStripeCustomer = (stripeAPIPrepData, stripeCustDataObj) => {
	stripeAPIPrepData = {
			path: "/v1/charges",
			method: "POST"
		};

		let dataInString = charge.prepChargeReqStr(stripeCustDataObj);

		try {
			
            charge.makeStripeReq(stripeAPIPrepData, dataInString).then(res => {
            	console.log('// - - - 8 - - //')
            	console.log('CHARGED!')
            	console.timeEnd('charge POST')
            	charge.callback(200, { Success: "CHARGED! :) " });
            	
            })
            .catch(err => {
            	console.log('makeStripeReq catch =>')
            	console.log(err)
            	console.timeEnd('charge POST')
            	charge.callback(400, { Error: "Error charging" });	
            });
        } catch (error) {
        	console.timeEnd('charge POST')
            charge.callback(400, { Error: "Could not charge" });
            return;
        }
}

module.exports = charge;