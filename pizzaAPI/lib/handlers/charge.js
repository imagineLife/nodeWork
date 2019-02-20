//Dependencies
const doTokens = require('./tokens')
const dataLib = require('../data')

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

						console.log('cartData')
						console.log(cartData)
						
					})

					callback(200, {'Success': 'matching token here'})
				})
			}
		})
	}
	
}

module.exports = charge;