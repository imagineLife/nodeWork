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

						//Prepare stripe communication object
						let stripeData = {
							path: `/v1/customers`,
							method: 'GET'
						}

						/* 
							interact with stripe API
							- customer lookup
							- customer creation
							- customer charging
						*/

						//prep the email string for stripe consumption
						const emailStr = queryString.stringify({email: userEmail});

					    /* 
					    	lookup stripe customer with user emailString
					    */
					    let stripeCustomerList = null;
					    let thisCustomerID = null;
					    let stripeCartID = null;

					    charge.makeStripeReq(charge.prepRequestObj(emailStr, stripeData), emailStr).then(res =>{

					    	// If there is customer data for the given email,
					    	// set this customer from result 
						    if (res.data.length >= 1) {
						        thisCustomerID = stripeCustomerList[0].id;
							// If no customer from strip matches this email,
							// create a new customer
						    } else {

						        stripeReqObj.method = "POST";

						        try {
						            charge.makeStripeReq(stripeReqObj, emailStr).then(res => {
						            	thisCustomerID = res.id;
						            });
						        } catch (error) {
						            callback(400, { Error: "Could not create a new customer" });
						            return;
						        }
						    }

						     /*
			            	 	 Create a stripe SOURCE for the customer
			            	 */
						    

					    	//Prepare stripe communication object
					        stripeData = {
					            path: `/v1/customers/${thisCustomerID}/sources`,
					            method: "POST"
					        };

					        let reqStrData = queryString.stringify({source: "tok_visa"})
					        
					        try {

					            charge.makeStripeReq(stripeReqObj, emailStr).then(res => {
					            	
					            	console.log('res')
					            	console.log(res)
					            	callback(200, {'Success': `made stripe source!`})
					            	

					            });

					        } catch (error) {
					        	console.log('error')
					        	console.log(error)
					        	
					            callback(400, { Error: 'Stripe SOURCE NOT successfull!' });
					            return;
					        }
					    	
					    })	
					})
				})
			}
		})
	}
	
}

//prepare stripe communication object
charge.prepRequestObj = (bufferData, pathMethod) => {
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