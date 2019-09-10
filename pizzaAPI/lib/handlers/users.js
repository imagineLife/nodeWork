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
//REQ FIELDS: first, last, phone, pw, tosAgreement, NO optional Data
doUsers.post = function(data,callback){
	
	//GET all req'd fields from request payload
	const dataPhone = data.payload.phoneNumber
	const dataTos = data.payload.tosAgreement

	//check that all req'd fields exist
	const fn = checkForLengthAndType(data.payload.firstName)
	const ln = checkForLengthAndType(data.payload.lastName)
	const pn = helpers.isString(dataPhone) && helpers.isLength(dataPhone,10) ? dataPhone.trim() : false;
	const pw = checkForLengthAndType(data.payload.passWord)
	const tosAg = typeof(dataTos) == 'boolean' && dataTos == true ? true : false;

	//THROW ERROR if payload doesn't contain req'd fields
	if(!fn || !ln || !pn || !pw || !tosAg){
		return callback(400,{'Error': 'Missing Reqd fields'})
	}

	/*
		make sure that user doesn't already exist
		USING the CRUD handlers from the data directory as a dependence above
		READ from users data using this data
	*/

	//check if user phoneNumber already exists
	//takes dir, fileName,callback
	dataLib.read('users', pn, (err,result) => {

		//User already exists
		if(!err){
			return callback(400,{'Error': 'A User with that number already exists'})
		}
		//Hash the password using built in library called crypto,
		//created in HELPERS file,
		//included in dependencies
		const hashedPW = helpers.hash(pw);

		//if the hashing succeeded save the user data
		//else below
		if(!hashedPW){
			return callback(500, {'ERROR': 'Could not hash'})
		}
		//create a user object from user data
		let userObj = {
			firstName: fn,
			lastName: ln,
			phone: pn,
			hashedPW: hashedPW,
			tosAgreement: true
		}

		//STORE this user to disk
		//create method takes dir,fileName,data,callback
		dataLib.create('users',pn,userObj,(err) => {
			if(!err){
				return callback(200, {'Success!': `User ${userObj.firstName} created successfully!`})
			}else{
				console.log(err)
				return callback(500, {'ERROR': 'Could not create the new user'})
			}
		})
	})
}

//Users PUT
//req phonenumber
//OPTIONAL - firstName, lastName, pw (at least ONE MUST be specified)
//@TODO only let auth user update their own obj. don't let them update others

doUsers.put = function(data,callback){
	
	//check that the phoneNumber is value
	const phoneNumber = typeof(data.payload.phoneNumber) == 'string' && data.payload.phoneNumber.trim().length == 10 ? data.payload.phoneNumber.trim() : false;

	//check for optional fields
	const fn = checkForLengthAndType(data.payload.firstName)
	const ln = checkForLengthAndType(data.payload.lastName)
	const pw = checkForLengthAndType(data.payload.passWord)

	//if phone number exists, keep going
	if(!phoneNumber){
		return callback(400, {'Error': 'Missing reqd field'})
	}

	//get token
	const passedToken = data.headers.token || null;
	
	if(!passedToken){
		return callback(403, {"Error": "missing token in header"})
	}

	routeHandlers.doTokens.verifyTokenMatch(passedToken, phoneNumber, (tokenIsValid) => {
		
		if(!tokenIsValid){
			return callback(403, {"ERROR": "invalid token"})
		}

		//if no other field is present to update
		if(!fn || !ln || !pw){
			return callback(400, {'Error': 'Missing updatable field'})
		}

		//lookup the user
		dataLib.read('users', phoneNumber, (err, userData) => {
			
			//check if file is error-less AND has userdata
			//if error or no data for that file
			if(err || !userData){
				return callback(400, {'Error': 'No data or file exists for that'})
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
			dataLib.update('users', phoneNumber, userData, (err) => {

				if(!err){
					return callback(200)
				}else{
					console.log(err)
					return callback(500, {'Error': 'Couldnt update this user with this info'})
				}

			})
		})
	})
}

//Users GET
doUsers.get = function(data,callback){

	//TEST this by using postman with
	// http://localhost:3000/users?phoneNumber=1238675309
	// should return the user object


	//check that the phoneNumber is value
	const phoneNumber = typeof(data.queryStrObj.phoneNumber) == 'string' && data.queryStrObj.phoneNumber.trim().length == 10 ? data.queryStrObj.phoneNumber.trim() : false;

	//if phone is valid
	if(!phoneNumber){
		return callback(400, {'Error': 'Seems like Missing phoneNumber field'})
	}

	//get token
	const passedToken = data.headers.token || null;
	
	if(!passedToken){
		return callback(403, {"Error": "missing token in header"})
	}

	routeHandlers.doTokens.verifyTokenMatch(passedToken, phoneNumber, (tokenIsValid) => {

		if(tokenIsValid !== true){
			return callback(403, {"ERROR": "invalid token"})
		}

		//lookup the user from the filesystem
		dataLib.read('users',phoneNumber, (err, storedUserData) => {
			if(!err && storedUserData){

				//REMOVE hashed pw from the user object before showing the user
				delete storedUserData.hashedPW;
				return callback(200, storedUserData);

			}else{

				//NOT FOUND USER
				return callback(404)
			}
		})
	})
	
}

//Users DELETE
doUsers.delete = function(data,callback){
	
	//check that phone is valid
	const phoneNumber = typeof(data.queryStrObj.phoneNumber) == 'string' && data.queryStrObj.phoneNumber.trim().length == 10 ? data.queryStrObj.phoneNumber.trim() : false;

	//if phone is valid
	if(!phoneNumber){
		return callback(400, {'Error': 'Seems like Missing phoneNumber field'})
	}

	//get token
	const passedToken = data.headers.token || null;
	
	if(!passedToken){
		return callback(403, {"Error": "missing token in header"})
	}

	routeHandlers.doTokens.verifyTokenMatch(passedToken, phoneNumber, (tokenIsValid) => {

		if(tokenIsValid !== true){
			return callback({403: "Invalid token"})
		}

		//lookup the user from the filesystem
		dataLib.read('users',phoneNumber, (err, storedUserData) => {
			
			//NOT FOUND USER
			if(err || !storedUserData){
				return callback(400, {'Error': 'Couldnt Find user'})
			}

			//REMOVE user
			dataLib.delete('users', phoneNumber, (err) => {

				if(err){
					return callback(500, {'Error' :'Couldnt delete this user for some odd reason'})
				}
					
				//Delete users-associated checks
				//get checks form userData
				let userChecks = typeof(storedUserData.checks) == 'object' && storedUserData.checks instanceof Array ? storedUserData.checks : [];
				
				const noOfChecks = userChecks.length;
				
				if(!(noOfChecks > 0)){
					return callback(200)
				}

				let checksDeleted = 0;
				let deleteErrs = false;
				
				userChecks.forEach(check => {
					dataLib.delete('checks', check, (err) => {
						if(err){
							deleteErrs = true;
						}
						checksDeleted++;
						if(checksDeleted == noOfChecks){
							if(deleteErrs){
								return callback(500, {'Err': 'Did not delete ALL checks: some checks may still be present associated with user.'})
							}
							return callback(200)
						}
					})
				})
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

module.exports = doUsers;