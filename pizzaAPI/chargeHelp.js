//Dependencies
const doTokens = require('./lib/handlers/tokens.js')
const dataLib = require('./lib/data.js')
const helpers = require('./lib/helpers.js')
const queryString = require('querystring');
const {STRIPE_API_HOST, STRIPE_API_TOKEN} = require('./config')
const https = require('https');

//holder of charge methods
let charge = {}

//charge POST
//REQ FIELDS: 
//	token in header
//	email in payload

charge.post = function(data,callback){

//store callback for easier access
// in related fns
charge.callback = callback;
	
	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;
	
	//if no token return 400
	if(!passedToken){
		callback(400, { Error: "Missing token" });
        return;
	}

	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, data.payload.email, (tokenIsValid) => {

		//if non-matching token
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

		//get user CART data from cart library
		dataLib.read('cart', data.payload.email, (err, cartData) => {
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

			stripeCustomerDataObj.cartTotal = thisCartTotal * 100

			/* 
				interact with STRIPE API
				- customer lookup
				- customer creation
				- customer charging
			*/

		   	//prepare stripe customer user emailString string
		    const emailStr = queryString.stringify({email: data.payload.email});

		    //Prepare stripe communication details
			let stripeAPIPrepData = {
				path: `/v1/customers`,
				method: 'GET'
			}

			//check for stripe customer
			try{

				charge.makeStripeReq(stripeAPIPrepData, emailStr)
					.then(stripeCustomerRes => {
						console.log('GET ALL CUSTOMERS result...')
						console.log(stripeCustomerRes)

						

						/*
							check for matching customer email form stripe
							IF matching, proceed
							ELSE make stripe customer acct THEN proceed
						*/
						if(stripeCustomerRes.data.length >= 1){
							charge.proceedWithStripeUser(stripeCustomerRes, stripeCustomerDataObj)
						}else{

							stripeAPIPrepData.method = "POST";

						    try {

						    	//Create New Stripe User
						        charge.makeStripeReq(stripeAPIPrepData, emailStr).then(res => {
						        	// console.log('Created Stripe User')
						        	// console.log('// - - - - - //')
						        	
						        	stripeCustomerDataObj.id = res.id;
						        	// console.log('stripeCustomerDataObj')
						        	// console.log(stripeCustomerDataObj)

						        	charge.proceedWithStripeUser(res, stripeCustomerDataObj)

						        });
						    } catch (error) {
						    	console.log('TRIED to make stripe user, error')
						    	console.log(error)
						    	
						       charge.callback(400, { Error: "Could not create a new customer" });
						        return;
						    }
						} 
					})
					.catch(err => {
						console.log('makeStripeReq err on v1/cust GET')
						console.log(err)
						callback(400, {'error': err})
					})

			}catch(e){
				console.log('error charging :(')
	        	console.log(error)	        	
	            callback(400, { Error: "No Customer present" });
	            return;
			}

		})
	})
}

/*
 	 Create a stripe SOURCE for the customer

 	 HELP REMOVE THIS. seems redundant repetitive
*/

charge.makeStripeSource = (stripeAPIData) => {
	console.log('making StripeSource!')
	
	let reqStrData = queryString.stringify({source: "tok_visa"})
    
	return new Promise(async function(resolve, reject) {
	    try {

	        charge.makeStripeReq(stripeAPIData, reqStrData)
	        	.then(res => {
	        		resolve(res.id)
	        	})
	        	.catch(err => {
	        		charge.callback(400, {"make stripe rep CATCH Error": err})
	        		reject("Error creating stripe source");
	        	});
	    } catch (error) {
	    	charge.callback(400, {"Error": error})
	        reject("Error creating stripe source");
	    }
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
					Not really necessary! Epic.
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
	

	reqObj.source = "tok_visa"

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

charge.proceedWithStripeUser = (res, stripeCustDataObj) => {

	console.log('// - - - 4 - - //')
	console.log('proceedWithStripeUser, IS customer')
	console.log('res.data')
	console.log(res.data)
	
	let resData = (res.data && res.data.length > 0) ? res.data[0] : res
	
	//set id
    stripeCustDataObj.id = resData.id;
    
   	//Look for a source from stripe, if so, save source to var
	stripeCustDataObj.source = (resData.sources.data.length > 0 ) ? resData.sources.data[0] : null
	
	//IF NO SOURCE
	//	 make a source
	//	 THEN charge the customer
	if(stripeCustDataObj.source == null){
		console.log('// - - - 5 - - //')
		console.log('NO customer SOURCE yet, need to MAKE one');
		

			/*
				could this turn into... something like... ?
				charge.makeSource()
					.then(chargeCustomer)
			*/

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

			//update stripe connecting details
			stripeAPIPrepData = {
				path: "/v1/charges",
				method: "POST"
			};

			//setup order request details in string
			let dataInString = charge.prepChargeReqStr(stripeCustDataObj);

			try {

	            charge.makeStripeReq(stripeAPIPrepData, dataInString).then(res => {
	            	charge.callback(200, { Success: "CHARGED! :) " });
	            });
	        } catch (error) {
	        	console.log('error charging :(')
	        	console.log(error)
	        	
	            charge.callback(400, { Error: "Could not create a new customer" });
	            return;
		    }

		})
	}


	//if there IS a source
	//	 charge the customer
	if(stripeCustDataObj.source !== null) {
		stripeAPIPrepData = {
			path: "/v1/charges",
			method: "POST"
		};

		console.log('// - - - 7 - - //')
		console.log('ALREADY SOURCES stripeCustDataObj.cartTotal')
		console.log(stripeCustDataObj.cartTotal)
		
		 

		let dataInString = charge.prepChargeReqStr(stripeCustDataObj);

		try {
			
            charge.makeStripeReq(stripeAPIPrepData, dataInString).then(res => {
            	console.log('// - - - 8 - - //')
            	console.log('CHARGED!')
            	charge.callback(200, { Success: "CHARGED! :) " });
            })
            .catch(err => {
            	console.log('error charging =>')
            	console.log(err)
            	
            });
        } catch (error) {
            charge.callback(400, { Error: "Could not charge" });
            return;
        }
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

module.exports = charge;