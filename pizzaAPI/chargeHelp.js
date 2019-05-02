//Dependencies
const doTokens = require('./lib/handlers/tokens.js')
const dataLib = require('./lib/data.js')
const helpers = require('./lib/helpers.js')
const doUsers = require('./lib/handlers/users')
const queryString = require('querystring');
const {STRIPE_API_HOST, STRIPE_API_TOKEN} = require('./env.js')
const https = require('https');

//holder of charge methods
let charge = {}

//charge POST
//REQ FIELDS: 
//	token in header
//	email in payload

charge.post = function(data,callback){

	//add stripeID in header req

	//Prepare stripe communication details
	let stripeAPIPrepData = {
		path: `/v1/customers`,
		method: 'GET'
	}

	//log the DURATION of this charge post method
	console.time('charge POST')
	console.log('chargePOST data')
	console.log(data)
	console.log('// - * - * - * - * - //')

	//store callback for easier access
	// in related fns
	charge.callback = callback;
	
	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;
	
	//if no token return 400
	if(!passedToken){
		console.timeEnd('charge POST')
		callback(400, { Error: "Missing token" });
        return;
	}



	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, data.payload.email, (tokenIsValid) => {

		//if non-matching token
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

		//get user CART data from cart library
		dataLib.read('cart', data.payload.email, (err, cartData) => {
			console.log('// - - - 2 - - //')
			console.log('read user CART data');
			console.log('cartData')
			console.log(cartData)
			

			if(!cartData || cartData == undefined){
				console.timeEnd('charge POST')
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

			stripeCustomerDataObj.cartTotal = thisCartTotal * 100

			/* 
				interact with STRIPE API
				- customer lookup
				- customer creation
				- customer charging
			*/

		   	//prepare stripe customer user emailString string
		    const emailStr = queryString.stringify({email: data.payload.email});

			//check for stripe customer		
			try{
				
				//check for stripeID passed through req payload
				let existingStripeID = data.payload.stripeID || null

				//if stripeID in payload
				if(existingStripeID !== null){
					console.log('IS stripeID in payload!!');
					console.log('// - - - - - //')
					
					thisCust = {id: existingStripeID}
					charge.proceedWithStripeUser(thisCust, stripeCustomerDataObj, stripeAPIPrepData)
				
				// if no stripe customer
				}else{

					stripeAPIPrepData.method = "POST";

				    try {
				    	//Create New Stripe User
				    	//returns customer object
				        charge.makeStripeReq(stripeAPIPrepData, emailStr).then(res => {
				        	
				        	stripeCustomerDataObj.id = res.id;

				        	// stre the stripe user ID in node user data
				        	doUsers.patch({email: data.payload.email, stripeID: res.id}, (patchedData) => {
				        		console.log('patchedData finished')
				        		console.log(patchedData)
				        	})

				        	charge.proceedWithStripeUser(res, stripeCustomerDataObj, stripeAPIPrepData)

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
            /*
					Not really necessary right now,
					can help prevent against ddos attacks
					maybe later...
            */
            // "Content-Length": Buffer.byteLength(reqStr)
        }
    };
}

charge.makeStripeReq = (reqObj, reqStr) => {
	console.log('making stripe req, reqStr =>  ')
	console.log(reqStr)
	console.log('// -- -- -- //');

	let stripeAPIResultData = null;
	return new Promise(async function(resolve, reject) {

		//can remove prepRequestObj
		//can remove makeStripeSource
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

	console.log('// - - - 4 - - //')
	console.log('proceedWithStripeUser, IS customer')
	
	/*

		NEEDS UPDATING, when there IS a customer
		returns a SOURCES object

	*/	
	
	//set id
    stripeCustDataObj.id = res.id;
    
   	//Look for a source from stripe, if so, save source to var
	stripeCustDataObj.source = (res.sources && res.sources.data && res.sources.data.length > 0 ) ? res.sources.data[0] : null

	//IF NO SOURCE
	//	 make a source
	//	 charge the customer
	if(stripeCustDataObj.source == null){
		console.log('// - - - 5 - - //')
		console.log('NO customer SOURCE yet, need to MAKE one');

    	//Update stripe communication object
        stripeAPIPrepData = {
            path: `/v1/customers/${stripeCustDataObj.id}/sources`,
            method: "POST"
        };

        let sourceString = queryString.stringify({source: "tok_visa"})

		//post a source for this customer
		charge.makeStripeReq(stripeAPIPrepData, sourceString).then(stripeSource => {

			console.log('// - - - 6 - - //')
			console.log('POSTing to sources stripeSource')
			
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

		console.log('// - - - 7 - - //')
		console.log('ALREADY SOURCES stripeCustDataObj.cartTotal')

		let dataInString = charge.prepChargeReqStr(stripeCustDataObj);

		try {
			
            charge.makeStripeReq(stripeAPIPrepData, dataInString).then(res => {
            	console.log('// - - - 8 - - //')
            	console.log('CHARGED!')
            	console.timeEnd('charge POST')
            	charge.callback(200, { Success: "CHARGED! :) " });
            	
            })
            .catch(err => {
            	console.log('error charging =>')
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