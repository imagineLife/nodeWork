const dataLib = require('../data')
const helpers = require('../helpers')
const routeHandlers = require('./index')
const doTokens = require('./tokens')
const u = require('util')
const debug = u.debuglog('USERS')

//request data checker fn
function checkForLengthAndType(data){
	let res = typeof(data) == 'string' && data.trim().length > 0 ? data.trim() : false;
	return res
}

const isEmailValid = str => typeof(str) == 'string' && str.includes('.com') && str.includes('@') ? str.trim() : false;

//deals with users CRUD methods
const doUsers = {}

//Users POST
//REQ FIELDS: first, last, email, pw, tosAgreement, NO optional Data
doUsers.post = function(data,callback){
	
	//GET all req'd fields from request payload
	const dataEmail = data.payload.email
	const dataAddr = data.payload.address
	const tosData = data.payload.tosAgreement

	//check that all req'd fields exist
	const fn = checkForLengthAndType(data.payload.firstName)
	const ln = checkForLengthAndType(data.payload.lastName)
	const eml = typeof(dataEmail) == 'string' && dataEmail.includes('@') && dataEmail.includes('.com') ? dataEmail.trim() : false;
	const pw = checkForLengthAndType(data.payload.passWord)
	const tosAg = typeof(tosData) == 'boolean' && tosData == true ? true : false;

	debug('\x1b[44m\x1b[37m%s\x1b[0m',`Users Post Data:`)
	debug('\x1b[44m\x1b[37m%s\x1b[0m',`First: ${fn}`)
	debug('\x1b[44m\x1b[37m%s\x1b[0m',`Last: ${ln}`)
	debug('\x1b[44m\x1b[37m%s\x1b[0m',`email: ${eml}`)
	debug('\x1b[44m\x1b[37m%s\x1b[0m',`pw: ${pw}`)
	debug('\x1b[44m\x1b[37m%s\x1b[0m',`tosAg: ${tosAg}`)

	//continue if all required fields are present
	if(!fn || !ln || !eml || !pw || !tosAg || !dataAddr){
		//THROW ERROR if payload doesn't contain req'd fields
		callback(400,{'Error': 'Missing required field(s)'})
		return;
	}
	/*
		make sure that user doesn't already exist
		USING the CRUD handlers from the data directory as a dependence above
		READ from users data using this data
	*/

	//check if user email already exists
	//takes dir, fileName,callback
	dataLib.read('users', eml, (err,result) => {

		//if it comes back with an error,
		// that means there IS no email address
		if(!err){
			//User already exists
			return callback(400,{'Error': 'A User with that email already exists'});
		}
		//Hash the password using built in library called crypto,
		//created in HELPERS file,
		//included in dependencies
		const hashedPW = helpers.hash(pw);

		//if the hashing succeeded save the user data
		//else below
		if(!hashedPW){
			return callback(500, {'ERROR': 'Could not hash'});
		}
		//create a user object from user data
		let userObj = {
			firstName: fn,
			lastName: ln,
			email: eml,
			streetAddress: dataAddr,
			hashedPW: hashedPW,
			tosAgreement: true
		}

		//STORE this user to disk
		//create method takes dir,fileName,data,callback
		dataLib.create('users',eml,userObj,(err) => {
			if(err){
				return callback(500, {'ERROR': 'Could not create the new user'})
			}
			return callback(200, {'Success!': `User ${userObj.firstName} created successfully!`})
		})

	})

}

//Users PUT
//req email
//OPTIONAL - firstName, lastName, pw (at least ONE MUST be specified)
//@TODO only let auth user update their own obj. don't let them update others

doUsers.put = function(data,callback){
	
	//check that the email is value
	const email = isEmailValid(data.queryStrObj.email)
	
	//check for optional fields
	const fn = checkForLengthAndType(data.payload.firstName)
	const ln = checkForLengthAndType(data.payload.lastName)
	const pw = checkForLengthAndType(data.payload.passWord)

	//sanity checking email field
	if(!email){
		callback(400, {'Error': 'Missing required email'})
	}

	//if at least one other field exists to update
	if(!fn || !ln || !pw){
		return callback(400, {'Error': 'Missing updatable field'})
	}

	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {
		
		//if invalid token
		if(!tokenIsValid){
			return callback(403, {'Error': 'Missing required token in header, or token invalid'})
		}

		//lookup the user
		dataLib.read('users', email, (err, userData) => {
			
			//if error or no data for that file
			if(!userData || err){
				callback(400, {'Error': 'No data or file exists for that file'})
				return;
			}

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

				if(err){
					return callback(500, {'Error': 'Couldnt update this user with this info'})
				}
				return callback(200, {"Success!": `${userData.firstName} ${userData.lastName} updated successfully`})
			})
		})
	})
}

//editing select key(s) in the user object
doUsers.patch = function(data, callback){

	//get userData
	dataLib.read('users', data.email, (err, userData) => {

		//append newData to retrieved user data
		const newData = {...userData, ...data}

		//Store the newly updated userData obj
		dataLib.update('users', data.email, newData, (err) => {

			if(err){
				return callback(500, {'Error': 'Couldnt update this user with this info'})
			}
			return callback(200, {"Success!": `${newData.firstName} ${newData.lastName} updated successfully`})
		})

	})

}

//Users GET
//requires token auth
doUsers.get = function(data,callback){

	//TEST this by using postman with
	// http://localhost:3000/users?email=jajo@gmail.com
	// should return the user object

	//check that the email is value
	const email = isEmailValid(data.queryStrObj.email);
	
	//sanity check email
	if(!email){
		callback(400, {'Error': 'Seems like Missing email field'})
		return;
	}

	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {

		//sanity check valid token
		if(!tokenIsValid){
			callback(403, {'Error': 'Missing required token in header, or token invalid'})
			return;
		}

		//lookup the user from the filesystem
		dataLib.read('users',email, (err, storedUserData) => {

			if(!storedUserData){
				callback(404, {"Err": "User not found"})
				return
			}

			if(err){
				callback(500, {"server Err": err})	
				return
			}

			//REMOVE hashed pw from the user object before showing the user
			delete storedUserData.hashedPW;
			callback(200, storedUserData);
		})

	})
	
}

//Users DELETE
//ONLY let auth'd users delete
//DONT let them delete OTHERS' accts
//CLEANUP other data files associated with this user
doUsers.delete = function(data,callback){
	
	//check that email is valid
	const email = isEmailValid(data.queryStrObj.email);

	//if email is notvalid
	if(!email){
		callback(400, {'Error': 'Seems like Missing email field'})
		return;
	}

	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	//verify that token is valid for passed email
	doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {
		
		//if token is invalud
		if(!tokenIsValid){
			return callback(403, {'Error': 'Missing required token in header, or token invalid'})
		}

		//lookup the user from the filesystem
		dataLib.read('users',email, (err, storedUserData) => {
			
			//NOT FOUND USER
			if(!storedUserData){
				return callback(400, {'Error': 'Couldnt Find user'})
			}

			if(!err && storedUserData){

				//REMOVE user
				dataLib.delete('users', email, (err) => {

					if(err){
						return callback(500, {'Error' :'Couldnt delete this user for some odd reason'})
					}

					return callback(200, {'Success!' : 'User deleted successfully'})
				})
			}
		})
	})
}

module.exports = doUsers;