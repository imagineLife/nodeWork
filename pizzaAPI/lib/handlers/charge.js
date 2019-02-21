//Dependencies
const doTokens = require('./tokens')
const dataLib = require('../data')
const helpers = require('../helpers')
const queryString = require('querystring');
const {STRIPE_API_HOST, STRIPE_API_TOKEN} = require('../../config')

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
					//takes dir, fileName,callback
					dataLib.read('cart', userEmail, (err, cartData) => {

						if(!cartData){
							callback(200, {'Error': 'No Cart for a user with this token'})
						}

						//if there is user cart data, get the cart  total
						let cartCost = cartData.cartData.reduce((acc, curVal) => {
							return acc + (curVal.price * curVal.count) 
						}, 0)

							//Prepare stripe data object
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

						//prep the email for stripe consumption
						const emailStr = queryString.stringify({email: userEmail});

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
					    console.log('stripeReqObj')
					    console.log(stripeReqObj)
					    callback(200, {'Success': 'prepared reqObj'})

					    /*
					    	{
					        reqData = {
					            email: userData.email
					        };
					        reqOptions = {
					            path: "/v1/customers",
					            method: "GET"
					        };
					    	helpers.stripe(reqOptions, reqData)

					    	const reqDataStr = querystring.stringify(reqData);

					    	reqOptions uses reqOptions && reqDataStr to build the big obj above

					    	passes reqObject to helpers.request
					    	helpers.request takes reqObj(bigObj) && emailStr(queryString.stringified email)

					    */
						
					})

					// callback(200, {'Success': 'matching token here'})
				})
			}
		})
	}
	
}

module.exports = charge;