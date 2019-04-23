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
	
	//if no token return 400
	if(!passedToken){
		callback(400, { Error: "Missing token" });
        return;
	}

	//verify that token is valid for passed phoneNumber
	doTokens.verifyTokenMatch(passedToken, dataEmail, (tokenIsValid) => {

		//if non-matching token
		if(!tokenIsValid){
			callback(400, { Error: "non-matching token for this user" });
			return;
		}

		//GET email from request payload
		const dataEmail = data.payload.email

		//prep holder for stripe customer data
		let stripeCustomerDataObj = {
			id: null,
			source: null,
			cartTotal: null
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

			stripeCustomerDataObj.cartTotal = thisCartTotal * 100

			/* 
				interact with STRIPE API
				- customer lookup
				- customer creation
				- customer charging
			*/

		   	//prepare stripe customer user emailString string
		    const emailStr = queryString.stringify({email: dataEmail});

		    //Prepare stripe communication details
			let stripeAPIPrepData = {
				path: `/v1/customers`,
				method: 'GET'
			}

			//check for stripe customer
			try{
				// WAS
				// charge.makeStripeReq(charge.prepRequestObj(emailStr, stripeAPIPrepData), emailStr)

				charge.makeStripeReq(stripeAPIPrepData, emailStr)
					.then(stripeCustomerRes => {
						stripeCustomerRes.data.length >= 1 ? charge.proceedWithStripeUser(stripeCustomerRes, stripeCustomerDataObj) : charge.createNewStripUser()
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
	        // WAS
	        // charge.makeStripeReq( charge.prepRequestObj(reqStrData, stripeAPIData), reqStrData)

	        charge.makeStripeReq(stripeAPIData, reqStrData)
	        	.then(res => {
	        		resolve(res.id)
	        	});
	    } catch (error) {
	        reject("Error creating stripe source");
	    }
	})
}

//prepare stripe communication object
charge.prepRequestObj = (reqStr, pathMethod) => {
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
            "Content-Length": Buffer.byteLength(reqStr)
        }
    };
}

charge.makeStripeReq = (reqObj, reqStr) => {

	reqObj.source = "tok_visa"

	let stripeAPIResultData = null;
	return new Promise(async function(resolve, reject) {

		//can remove prepRequestObj
		//can remove makeStripeSource
        try {
            stripeAPIResultData = await helpers.request(charge.prepRequestObj(reqObj), reqStr);
        } catch (error) {
            reject("Error calling to Stripe");
            return;
        }
        resolve(stripeAPIResultData);
    });
}

charge.proceedWithStripeUser = (res, stripeCustDataObj) => {

	console.log('// - - - 4 - - //')
	console.log('proceedWithStripeUser, IS customer')
	
	let resData = res.data[0]
	
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

		//post a source for this customer
		charge.makeStripeSource(stripeAPIPrepData).then(stripeSource => {

			console.log('// - - - 6 - - //')
			console.log('POST to sources stripeSource result => ')
			console.log(stripeSource)
			
			stripeCustDataObj.source = stripeSource

			//update stripe connecting details
			stripeAPIPrepData = {
				path: "/v1/charges",
				method: "POST"
			};

			//setup order request details in string
			let dataInString = charge.prepChargeReqStr(stripeCustDataObj);


			try {
				// WAS
	            // charge.makeStripeReq(charge.prepRequestObj(dataInString, stripeAPIPrepData), dataInString).then(res => {
	            charge.makeStripeReq(stripeAPIPrepData dataInString).then(res => {
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
			//  WAS
            // charge.makeStripeReq(charge.prepRequestObj(dataInString, stripeAPIPrepData), dataInString).then(res => {
            charge.makeStripeReq(stripeAPIPrepData, dataInString).then(res => {
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
}

charge.createNewStripUser(){
	console.log('// - - - 9 - - //')
	console.log('No customer yet, making stripe customer')

    stripeAPIPrepData.method = "POST";

    try {
        charge.makeStripeReq(stripeAPIPrepData, emailStr).then(res => {
        	stripeCustomerDataObj.id = res.id;
        	
        	//Update stripe communication object
	        stripeAPIPrepData = {
	            path: `/v1/customers/${stripeCustomerDataObj.id}/sources`,
	            method: "POST"
	        };
        	
        	charge.makeStripeSource(stripeAPIPrepData).then(stripeSource => {
        		stripeCustomerDataObj.source = stripeSource;

				console.log('// - - - 10 - - //')
            	console.log('Made source');
            	console.log('stripeCustomerDataObj')
            	console.log(stripeCustomerDataObj)
            	

            	stripeAPIPrepData = {
					path: "/v1/charges",
					method: "POST"
				};

				let dataInString = charge.prepChargeReqStr(stripeCustomerDataObj);

				try {
		            charge.makeStripeReq(stripeAPIPrepData, dataInString).then(res => {
		            	console.log('// - - - 11 - - //')
		            	console.log('CHARGE res')
		            	console.log(res)

		            	callback(200, { Success: "CHARGED! :) " });
		            })
		            	
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