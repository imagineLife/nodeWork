const dataLib = require('../../data')
const helpers = require('../../helpers')
const routeHandlers = require('../index')
const doTokens = require('./tokens')
const u = require('util')
const debug = u.debuglog('CART')

//request data checker fn
function checkForLengthAndType(data){
	let res = typeof(data) == 'string' && data.trim().length > 0 ? data.trim() : false;
	return res
}

const isEmailValid = str => typeof(str) == 'string' && str.includes('.com') && str.includes('@') ? str.trim() : false;

//deals with cart
const doCart = {}

//cart POST
//REQ FIELDS: 
//	token in header
//	email in payload
//	cart in payload

doCart.post = function(data,callback){
	debug('\x1b[32m\x1b[37m%s\x1b[0m','Post Data:')
	debug(data);

	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;	

	//GET all req'd fields from request payload
	const dataEmail = typeof(data.payload.email) == 'string' 
		&& data.payload.email.includes('@') 
		&& data.payload.email.includes('.com') 
		? data.payload.email.trim() : false;
	
	if(dataEmail == false){
		callback(500, {'ERROR': 'Error in user email'})
		return;
	}

	let validCartPrices = data.payload.cart.map(itm => (itm.price && itm.price !== 0) ? true : false);
	validCartPrices = (validCartPrices.some(itm => itm == false)) ? false : true

	if(validCartPrices == false){
		callback(500, {'ERROR': 'Error in cart prices'})
		return;
	}

	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, dataEmail, (tokenIsValid) => {
		
		if(!tokenIsValid){
			callback(403, {'Error': 'Missing required token in header, or token invalid'})
			return;
		}

		const cartFromUser = data.payload.cart

		//check if user cart already exists
		//takes dir, fileName,callback
		dataLib.read('cart', dataEmail, (err, cartData) => {				
			
			if(cartData !== undefined){
				//Cart already exists
				callback(400,{'Error': 'A cart under that user already exists'})
				return;
			}
				
			//create a user object from user data
			let dataObj = {
				email: dataEmail,
				cartData: cartFromUser
			}

			//STORE this user to disk
			//create method takes dir,fileName,data,callback
			dataLib.create('cart',dataEmail,dataObj,(err) => {
				if(!err){
					callback(200, {'Success!': `Cart for ${dataEmail} created successfully!`})
				}else{
					callback(500, {'ERROR': 'Could not create the new cart'})
					console.log(err)
				}
			})

		})

	})

}

//Cart PUT
//req email && item
doCart.put = function(data,callback){
	debug('\x1b[32m\x1b[37m%s\x1b[0m','Put Data:')
	debug(data);
	//check that the email is value
	const email = isEmailValid(data.queryStrObj.email)
	
	//check for optional fields
	const cart = checkForLengthAndType(data.payload.cart)

	//if email is invalid, Error 
	if(!email){
		callback(400, {'Error': 'Missing reqd email'})
		return;
	}

	//check for updatable fields
	if(!cart){
		callback(400, {'Error': 'Missing updatable cart data'})
		return;	
	}

	if(!data.headers.token){
		return callback(404,{'Error':'Missing token in header'})
	}

	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {
		if(!tokenIsValid){
			callback(403, {'Error': 'Missing required token in header, or token invalid'})
			return;
		}
		callback(200, {'MORE': 'need to update the code to update the cart'})

		//lookup the cart
		// dataLib.read('cart', email, (err, cartData) => {
			
		// 	//if error or no data for that file
		// 	if(err){
		// 		callback(400, {'Error': 'No cart exists for that user'})
		// 		return;
		// 	}

		//EDIT CART HERE

		// 	//Store the newly updated cartData obj
		// 	dataLib.update('cart', email, cartData, (err) => {

		// 		if(!err){
		// 			callback(200, {"Success!": `${cartData.firstName} ${cartData.lastName} updated successfully`})
		// 		}else{
		// 			callback(500, {'Error': 'Couldnt update this user with this info'})
		// 		}

		// 	})

		// })

	})
}

// GET cart	
doCart.get = function(data,callback){
	debug('\x1b[32m\x1b[37m%s\x1b[0m','Get Data:')
	debug(data);
	
	//TEST this by using postman with
	// http://localhost:3000/users?email=jajo@gmail.com
	// should return the user object

	//check that the email is valid
	const email = isEmailValid(data.queryStrObj.email);
	if(!email){
		callback(400, {'Error': 'Seems like Missing email field'})
		return;
	}

	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {

		if(!tokenIsValid){
			callback(403, {'Error': 'Missing required token in header, or token invalid'})
			return;
		}

		//lookup the user from the filesystem
		dataLib.read('cart',email, (err, storedCartData) => {
			if(!storedCartData){
				//NOT FOUND USER
				callback(404, {'Error': 'no data for that user'})
				return;
			}
			if(err){
				callback(404, {'Error': err})
				return
			}

			//REMOVE hashed pw from the user object before showing the user
			delete storedCartData.hashedPW;
			callback(200, storedCartData);
		})

	})
	
}

//cart DELETE
//ONLY let auth'd users delete
//DONT let them delete OTHERS' carts
//CLEANUP other data files associated with this user
doCart.delete = function(data,callback){
	debug('\x1b[32m\x1b[37m%s\x1b[0m','Delete Data:')
	debug(data);
	
	//check that email is valid
	const email = isEmailValid(data.queryStrObj.email);

	if(!email){
		callback(400, {'Error': 'Seems like Missing email field'})
		return;	
	}

	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {
		if(!tokenIsValid){
			callback(403, {'Error': 'Missing required token in header, or token invalid'})
			return;
		}
			
		//REMOVE cart
		let deleteRes;
		try{
			//on success, returns undefined
			deleteRes = dataLib.deleteSync('cart', email);	
			callback(200, {'Success!' : 'Cart deleted successfully'})
		}catch(err){
			console.log('err')
			console.log(err)
			callback(500, {'Error' :'Couldnt delete this user for some odd reason'})
		}
	})
}

module.exports = doCart;