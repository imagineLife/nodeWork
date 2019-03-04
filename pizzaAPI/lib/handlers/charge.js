//Dependencies
const doTokens = require('./tokens')
const dataLib = require('../data')
const helpers = require('../helpers')
const queryString = require('querystring');
const {STRIPE_API_HOST, STRIPE_API_TOKEN} = require('../../config')
const https = require('https');

//holder of charge methods
let charge = {}

//charge POST
//REQ FIELDS: 
//	token in header
//	email in payload

charge.post = function(data,callback){
	
	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;
	
	if(!passedToken){
		callback(400, { Error: "Missing token" });
        return;
	}else{

		//GET all req'd fields from request payload
		const dataEmail = data.payload.email

		//verify that token is valid for passed phoneNumber
		doTokens.verifyTokenMatch(passedToken, dataEmail, (tokenIsValid) => {
			
			//if non-matching token
			if(!tokenIsValid){
				callback(400, { Error: "non-matching token for this user" });
				return;
			}else{

				//look up the token data
				dataLib.read('tokens',passedToken, (err,tokenData) => {

					if(!tokenData){
						callback(400, { Error: "no tokenData" });
						return;
					}

					//get userEmail from token data
					let userEmail = tokenData.email;

					//get user CART data from cart library
					dataLib.read('cart', userEmail, (err, cartData) => {

						if(!cartData || cartData == undefined){
							callback(400, {'Error': 'No Cart for a user with this token'})
							return;
						}
						
						//if there is user cart data, get the cart  total
						let cartCost = cartData.cartData.reduce((acc, curVal) => {
							return acc + (curVal.price * curVal.count) 
						}, 0)

						/* 
							interact with stripe API
							- customer lookup
							- customer creation
							- customer charging
						*/

					    /* 
					    	lookup stripe customer with user emailString
					    */
					    const emailStr = queryString.stringify({email: userEmail});

					    //Prepare stripe communication object
						let stripeAPIPrepData = {
							path: `/v1/customers`,
							method: 'GET'
						}

						//prep holder for stripe customer data
						let stripeCustomerData = {
							id: null,
							source: null
						}

					    charge.makeStripeReq(charge.prepRequestObj(emailStr, stripeAPIPrepData), emailStr).then(res =>{
					    	
					    	// If there is customer data for the given email,
					    	// set this customer from result 
						    if (res.data.length >= 1) {
						        stripeCustomerData.id = res.data[0].id;
						        
						       	//Look for a source, if so, save source to var
						    	stripeCustomerData.source = (res.data[0].sources.data.length > 0 ) ? res.data[0].sources.data[0] : null

						    	//if no source, make a source
						    	//then charge the customer
						    	if(stripeCustomerData.source == null){
						    		console.log('IS customer id from stripe')
						    		console.log('NO customer SOURCE yet');

						    		// callback(400, { Error: "hmm" });
						    		
							    	//Update stripe communication object
							        stripeAPIPrepData = {
							            path: `/v1/customers/${stripeCustomerData.id}/sources`,
							            method: "POST"
							        };
						    		//updated stripe api data
						    		charge.makeStripeSource(stripeCustomerData.id, stripeAPIPrepData).then(stripeSource => {
						    			stripeCustomerData.source = stripeSource

						    			// charge.chargeCustomer
						    		})
						    	}

							// If no customer from strip matches this email,
							// create a new customer
						    } else {

						    	console.log('No customer, making customer')

						        stripeAPIPrepData.method = "POST";

						        try {
						            charge.makeStripeReq(charge.prepRequestObj(emailStr, stripeAPIPrepData), emailStr).then(res => {
						            	stripeCustomerData.id = res.id;
						            	console.log('stripeCustomerData')
						            	console.log(stripeCustomerData)
						            	
						            	//Update stripe communication object
								        stripeAPIPrepData = {
								            path: `/v1/customers/${stripeCustomerData.id}/sources`,
								            method: "POST"
								        };
						            	
						            	charge.makeStripeSource(stripeCustomerData.id, stripeAPIPrepData).then(stripeSource => {
						            		strupeCustomerData.source = stripeSource;
						            		
						            	})

						            	
						            	// callback(400, { Success: "Got here :) " });
						            });
						        } catch (error) {
						            callback(400, { Error: "Could not create a new customer" });
						            return;
						        }

			            	 }
					    })	
					})
				})
			}
		})
	}
	
}

/*
 	 Create a stripe SOURCE for the customer
*/
charge.makeStripeSource = (stripeID, stripeAPIData) => {
	console.log('making StripeSource!')
	
	let reqStrData = queryString.stringify({source: "tok_visa"})
    
	return new Promise(async function(resolve, reject) {
	    try {
	        charge.makeStripeReq(charge.prepRequestObj(reqStrData, stripeAPIData), reqStrData).then(res => {
	        	resolve(res.id)
	        });
	    } catch (error) {
	        reject("Error creating stripe source");
	    }
	})
}

//prepare stripe communication object
charge.prepRequestObj = (bufferData, pathMethod) => {
	console.log('pathMethod')
	console.log(pathMethod)
	
	return {
        host: STRIPE_API_HOST,
        // port: STRIPE_PORT,
        path: pathMethod.path,
        method: pathMethod.method,
        headers: {
            Authorization: `Bearer ${STRIPE_API_TOKEN}`,
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(bufferData)
        }
    };
}

charge.makeStripeReq = (reqObj, reqStr) => {

	let stripeAPIResultData = null;
	return new Promise(async function(resolve, reject) {
        try {
            stripeAPIResultData = await helpers.request(reqObj, reqStr);
        } catch (error) {
            reject("Error calling to Stripe");
            return;
        }
        resolve(stripeAPIResultData);
    });	
} 

module.exports = charge;