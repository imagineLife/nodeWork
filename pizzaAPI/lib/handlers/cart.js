const dataLib = require('../data')
const helpers = require('../helpers')
const routeHandlers = require('./index')
const doTokens = require('./tokens')
const u = require('util')
const debug = u.debuglog('CART')

//request data checker fn
function checkForLengthAndType(data){
	let res = typeof(data) == 'string' && data.trim().length > 0 ? data.trim() : false;
	return res
}

const isEmailValid = str => typeof(str) == 'string' && str.includes('.com') && str.includes('@') ? str.trim() : false;

//deals with users CRUD methods
const doCart = {}

//cart POST
//REQ FIELDS: 
//	token in header
//	email in payload
//	cart in payload

doCart.post = function(data,callback){
	debug('\x1b[32m\x1b[37m%s\x1b[0m','Cart Post Data:')
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

	//verify that token is valid for passed phoneNumber
	doTokens.verifyTokenMatch(passedToken, dataEmail, (tokenIsValid) => {
		if(tokenIsValid){

			const cartFromUser = data.payload.cart

			//check if user cart already exists
			//takes dir, fileName,callback
			dataLib.read('cart', dataEmail, (err, cartData) => {				
				
				//if it comes back with an error,
				// that means there IS no cart for this user yet
				if(cartData == undefined && err){
					
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

				}else{
					//Cart already exists
					callback(400,{'Error': 'A cart under that user already exists'})
				}

			})

		}else{
			callback(403, {'Error': 'Missing required token in header, or token invalid'})
		}

	})

}

//Users PUT
//req email
//OPTIONAL - firstName, lastName, pw (at least ONE MUST be specified)
//@TODO only let auth user update their own obj. don't let them update others

doCart.put = function(data,callback){
	
	//check that the email is value
	const email = isEmailValid(data.queryStrObj.email)
	
	//check for optional fields
	const fn = checkForLengthAndType(data.payload.firstName)
	const ln = checkForLengthAndType(data.payload.lastName)
	const pw = checkForLengthAndType(data.payload.passWord)

	//if phone number exists, keep going
	if(email){

		//if at least one other field exists to update
		if(fn || ln || pw){

			//GET token from headers
			const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

			//verify that token is valid for passed phoneNumber
			doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {
				if(tokenIsValid){

					//lookup the user
					dataLib.read('users', email, (err, userData) => {
						
						//check if file is error-less AND has userdata
						if(!err && userData){

							//update the field in the userData 
							if(fn){
								userData.firstName = fn;
							}
							if(ln){
								userData.lastName = ln;
							}
							if(pw){
								userData.passWord = helpers.hash(pw);
							}

							//Store the newly updated userData obj
							dataLib.update('users', email, userData, (err) => {

								if(!err){
									callback(200, {"Success!": `${userData.firstName} ${userData.lastName} updated successfully`})
								}else{
									callback(500, {'Error': 'Couldnt update this user with this info'})
								}

							})


						//if error or no data for that file
						}else{
							callback(400, {'Error': 'No data or file exists for that'})
						}
					})

				}else{
					callback(403, {'Error': 'Missing required token in header, or token invalid'})
				}

			})

		}else{
			callback(400, {'Error': 'Missing updatable field'})
		}

	//if phone is invalid, Error 
	}else{
		callback(400, {'Error': 'Missing reqd field'})
	}
}

//Users GET
// TODO - - - - NOTE: only let an authenticated users access their obj.
//	
doCart.get = function(data,callback){

	//TEST this by using postman with
	// http://localhost:3000/users?email=jajo@gmail.com
	// should return the user object

	//check that the email is value
	const email = isEmailValid(data.queryStrObj.email);
	
	//if phone is valid
	if(email){

		//GET token from headers
		const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		//verify that token is valid for passed email
		doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {

			//IF token MATCHES email
			if(tokenIsValid){

				//lookup the user from the filesystem
				dataLib.read('cart',email, (err, storedCartData) => {
					if(!err && storedCartData){

						//REMOVE hashed pw from the user object before showing the user
						delete storedCartData.hashedPW;
						callback(200, storedCartData);

					}else{

						//NOT FOUND USER
						callback(404)
					}
				})

			}else{
				callback(403, {'Error': 'Missing required token in header, or token invalid'})
			}

		})

	}else{	
		callback(400, {'Error': 'Seems like Missing email field'})
	}
	
}

//cart DELETE
//ONLY let auth'd users delete
//DONT let them delete OTHERS' carts
//CLEANUP other data files associated with this user
doCart.delete = function(data,callback){
	console.log('delete CART?!');
	
	//check that phone is valid
	const email = isEmailValid(data.queryStrObj.email);

	//if phone is valid
	if(email){

		//GET token from headers
		const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		//verify that token is valid for passed email
		doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {
			if(tokenIsValid){
				
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

			}else{
				callback(403, {'Error': 'Missing required token in header, or token invalid'})
			}
		})

	}else{	
		callback(400, {'Error': 'Seems like Missing email field'})
	}
}

module.exports = doCart;