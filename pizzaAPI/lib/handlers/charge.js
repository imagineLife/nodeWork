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

	//prep holder for stripe customer data
	let stripeCustomerData = {
		id: null,
		source: null,
		cartTotal: null
	}
	
	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;
	
	//if no token return 400
	if(!passedToken){
		callback(400, { Error: "Missing token" });
        return;
	}

	//GET email from request payload
	const dataEmail = data.payload.email

	//verify that token is valid for passed phoneNumber
	doTokens.verifyTokenMatch(passedToken, dataEmail, (tokenIsValid) => {
		
		//if non-matching token
		if(!tokenIsValid){
			callback(400, { Error: "non-matching token for this user" });
			return;
		}

		//look up the token data
		dataLib.read('tokens', passedToken, (err,tokenData) => {
			console.log('// - - - 1 - - //')
			console.log('read user TOKEN data');

			//if no token
			if(!tokenData){
				callback(400, { Error: "no tokenData" });
				return;
			}

			//get user CART data from cart library
			dataLib.read('cart', dataEmail, (err, cartData) => {
				console.log('// - - - 2 - - //')
				console.log('read user CART data');
				console.log('cartData')
				console.log(cartData)
				

				if(!cartData || cartData == undefined){
					callback(400, {'Error': 'No Cart for a user with this token'})
					return;
				}
				

				/*
					get the cart  total
					if there is user cart data
					NOTE: must be in pennies for stripe ($10 gets translated to 1000 for stripe)
				*/
				let thisCartTotal = cartData.cartData.reduce((acc, curVal) => {
					return acc + (curVal.price * curVal.count) 
				}, 0)

				stripeCustomerData.cartTotal = thisCartTotal * 100

				/* 
					interact with STRIPE API
					- customer lookup
					- customer creation
					- customer charging
				*/

			   	//lookup stripe customer with user emailString
			    const emailStr = queryString.stringify({email: dataEmail});

			    //Prepare stripe communication details
				let stripeAPIPrepData = {
					path: `/v1/customers`,
					method: 'GET'
				}

				//check for stripe customer
			    charge.makeStripeReq(charge.prepRequestObj(emailStr, stripeAPIPrepData), emailStr).then(res =>{
			    	console.log('// - - - 3 - - //')
			    	console.log('checked for stripe customer');
			    	
			    	// If there is customer data for the given email,
			    	// set this customer from stripe result 
				    if (res.data.length >= 1) {
				    	console.log('// - - - 4 - - //')
				    	console.log('IS customer')
				    	
				    	let resData = res.data[0]
				    	
				    	//set id
				        stripeCustomerData.id = resData.id;
				        
				       	//Look for a source from stripe, if so, save source to var
				    	stripeCustomerData.source = (resData.sources.data.length > 0 ) ? resData.sources.data[0] : null
				    	
				    	//if no source, make a source
				    	//THEN charge the customer
				    	if(stripeCustomerData.source == null){
				    		console.log('// - - - 5 - - //')
				    		console.log('NO customer SOURCE yet, need to MAKE one');
				    		
					    	//Update stripe communication object
					        stripeAPIPrepData = {
					            path: `/v1/customers/${stripeCustomerData.id}/sources`,
					            method: "POST"
					        };

				    		//post a source for this customer
				    		charge.makeStripeSource(stripeCustomerData.id, stripeAPIPrepData).then(stripeSource => {

				    			console.log('// - - - 6 - - //')
				    			console.log('POST to sources stripeSource result => ')
				    			console.log(stripeSource)
				    			
				    			stripeCustomerData.source = stripeSource

				    			//update stripe connecting details
								stripeAPIPrepData = {
									path: "/v1/charges",
									method: "POST"
								};

								//setup order request details
								reqData = {
									amount: stripeCustomerData.cartTotal,
									currency: "usd",
									customer: stripeSource.customer,
									description: "Ordering pizza"
								};


								let dataInString = queryString.stringify(reqData);


								try {
						            charge.makeStripeReq(charge.prepRequestObj(dataInString, stripeAPIPrepData), dataInString).then(res => {
						            	callback(200, { Success: "CHARGED! :) " });
						            });
						        } catch (error) {
						        	console.log('error charging :(')
						        	console.log(error)
						        	
						            callback(400, { Error: "Could not create a new customer" });
						            return;
							    }

				    		})
				    	}

				    	//if there IS a source, charge the customer
				    	if(stripeCustomerData.source !== null) {
				    		stripeAPIPrepData = {
								path: "/v1/charges",
								method: "POST"
							};

							console.log('// - - - 7 - - //')
							console.log('ALREADY SOURCES stripeCustomerData.cartTotal')
							console.log(stripeCustomerData.cartTotal)
							

							reqData = {
								amount: stripeCustomerData.cartTotal,
								currency: "usd",
								customer: stripeCustomerData.source.customer,
								description: "Ordering pizza"
							};


							let dataInString = queryString.stringify(reqData);

							try {
					            charge.makeStripeReq(charge.prepRequestObj(dataInString, stripeAPIPrepData), dataInString).then(res => {
					            	console.log('// - - - 8 - - //')
					            	console.log('CHARGED!')
					            	// console.log(res)
					            	callback(200, { Success: "CHARGED! :) " });
					            })
					            .catch(err => {
					            	console.log('error charging =>')
					            	console.log(err)
					            	
					            });
					        } catch (error) {
					            callback(400, { Error: "Could not charge" });
					            return;
					        }
				    	}

					// If no customer from strip matches this email,
					// create a new stripe customer
				    } else {

				    	console.log('// - - - 9 - - //')
				    	console.log('No customer yet, making stripe customer')

				        stripeAPIPrepData.method = "POST";

				        try {
				            charge.makeStripeReq(charge.prepRequestObj(emailStr, stripeAPIPrepData), emailStr).then(res => {
				            	stripeCustomerData.id = res.id;
				            	
				            	//Update stripe communication object
						        stripeAPIPrepData = {
						            path: `/v1/customers/${stripeCustomerData.id}/sources`,
						            method: "POST"
						        };
				            	
				            	charge.makeStripeSource(stripeCustomerData.id, stripeAPIPrepData).then(stripeSource => {
				            		stripeCustomerData.source = stripeSource;

									console.log('// - - - 10 - - //')
					            	console.log('Made source');
					            	console.log('stripeCustomerData')
					            	console.log(stripeCustomerData)
					            	

					            	stripeAPIPrepData = {
										path: "/v1/charges",
										method: "POST"
									};
									
									reqData = {
										amount: stripeCustomerData.cartTotal,
										currency: "usd",
										customer: stripeCustomerData.id,
										description: "Ordering pizza"
									};

									let dataInString = queryString.stringify(reqData);

									try {
							            charge.makeStripeReq(charge.prepRequestObj(dataInString, stripeAPIPrepData), dataInString).then(res => {
							            	console.log('// - - - 11 - - //')
							            	console.log('CHARGE res')
							            	console.log(res)

							            	//DOES NOT CATCH res.error's ... ?! odd

							            	callback(200, { Success: "CHARGED! :) " });
							            })
							            //Why not this instead of try/catch?! 
							            //Try catch seems like it can look pretty clean
							            // .catch(err => {
							            // 	console.log('error charging =>')
							            // 	console.log(err)
							            	
							            // });
							        } catch (error) {
							            callback(400, { Error: "Could not charge" });
							            return;
							        }
							    })


				            });
				        } catch (error) {
				            callback(400, { Error: "Could not create a new customer" });
				            return;
				        }

	            	 }
			    })	
			})
		})
	})
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