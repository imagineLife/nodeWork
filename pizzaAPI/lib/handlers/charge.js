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
			}else{

				//look up the token data
				dataLib.read('tokens',passedToken, (err,tokenData) => {

					if(!tokenData){
						callback(400, { Error: "no tokenData" });
					}

					//get userEmail from token data
					let userEmail = tokenData.email;

					//get user CART data from cart library
					dataLib.read('cart', userEmail, (err, cartData) => {

						if(!cartData){
							callback(200, {'Error': 'No Cart for a user with this token'})
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

						//prepare stripe communication object
						let stripeReqObj = {
					        host: STRIPE_API_HOST,
					        // port: STRIPE_PORT,
					        path: stripeData.path,
					        method: stripeData.method,
					        headers: {
					            Authorization: `Bearer ${STRIPE_API_TOKEN}`,
					            Accept: "application/json",
					            "Content-Type": "application/x-www-form-urlencoded",
					            "Content-Length": Buffer.byteLength(emailStr)
					        }
					    };

					    /* 
					    	lookup stripe customer with user emailString
					    */
					    let stripeCustomerList = null;
					    let thisCustomer = null;

					    charge.makeStripeReq(stripeReqObj, emailStr).then(res =>{

					    	stripeCustomerList = res.data;

					    	// If there is customer data for the given email,
					    	// set this customer from result 
						    if (stripeCustomerList.length >= 1) {
						        thisCustomer = stripeCustomerList[0];

						    	// callback(200, {'Success': 'FOUND the customer!!'})

							// If no customer from strip matches this email, 
							// create a new customer						    	
						    } else {
						        stripeReqObj.method = "POST";

						        try {
						            charge.makeStripeReq(stripeReqObj, emailStr).then(res => {
						            	console.log('res')
						            	console.log(res)
						            	
						            	// callback(200, {'Success': 'Made new customer!!'})
						            });
						        } catch (error) {
						            callback(400, { Error: "Could not create a new customer" });
						            return;
						        }
						    }
					    	console.log('thisCustomer')
					    	console.log(thisCustomer)
					    	
					    	callback(200, {'Success': 'Stripe request sucessfull!'})
					    })	
					})
				})
			}
		})
	}
	
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