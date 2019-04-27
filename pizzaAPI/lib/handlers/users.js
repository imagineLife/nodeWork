const dataLib = require('../data')
const helpers = require('../helpers')
const routeHandlers = require('./index')
const doTokens = require('./tokens')

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
	const dataEmail = data.payload.email
	const dataAddr = data.payload.address
	const dataTos = data.payload.tosAgreement

	//check that all req'd fields exist
	const fn = checkForLengthAndType(data.payload.firstName)
	const ln = checkForLengthAndType(data.payload.lastName)
	const eml = typeof(dataEmail) == 'string' && dataEmail.includes('@') && dataEmail.includes('.com') ? dataEmail.trim() : false;
	const pw = checkForLengthAndType(data.payload.passWord)
	const tosAg = typeof(dataTos) == 'boolean' && dataTos == true ? true : false;


	//continue if all reqd fields are present
	if(fn && ln && eml && pw && tosAg && dataAddr){
		/*
			make sure that user doesn't already exist
			USING the CRUD handlers from the data directory as a dependence above
			READ from users data using this data
		*/

		//check if user phoneNumber already exists
		//takes dir, fileName,callback
		dataLib.read('users', eml, (err,result) => {

			//if it comes back with an error,
			// that means there IS no email address
			if(err){
				//Hash the password using built in library called crypto,
				//created in HELPERS file,
				//included in dependencies
				const hashedPW = helpers.hash(pw);

				//if the hashing succeeded save the user data
				//else below
				if(hashedPW){
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
						if(!err){
							callback(200, {'Success!': `User ${userObj.firstName} created successfully!`})
						}else{
							callback(500, {'ERROR': 'Could not create the new user'})
						}
					})
				}else{
					callback(500, {'ERROR': 'Could not hash'})
				}


			}else{
				//User already exists
				callback(400,{'Error': 'A User with that email already exists'})
			}
		})

	
	}else{
	//THROW ERROR if payload doesn't contain req'd fields
		callback(400,{'Error': 'Missing Reqd fields'})
	}

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

//editing select key(s) in the user object
doUsers.patch = function(data, callback){

	//get userData
	dataLib.read('users', data.email, (err, userData) => {

		//append newData to retrieved user data
		const newData = {...userData, ...data}

		//Store the newly updated userData obj
		dataLib.update('users', data.email, newData, (err) => {

			if(!err){
				callback(200, {"Success!": `${newData.firstName} ${newData.lastName} updated successfully`})
			}else{
				callback(500, {'Error': 'Couldnt update this user with this info'})
			}

		})

	})

}

//Users GET
// TODO - - - - NOTE: only let an authenticated users access their obj.
//	
doUsers.get = function(data,callback){

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
				dataLib.read('users',email, (err, storedUserData) => {
					if(!err && storedUserData){

						//REMOVE hashed pw from the user object before showing the user
						delete storedUserData.hashedPW;
						callback(200, storedUserData);

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

//Users DELETE
//ONLY let auth'd users delete
//DONT let them delete OTHERS' accts
//CLEANUP other data files associated with this user
doUsers.delete = function(data,callback){
	
	//check that phone is valid
	const email = isEmailValid(data.queryStrObj.email);

	//if phone is valid
	if(email){

		//GET token from headers
		const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		//verify that token is valid for passed email
		doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {
			if(tokenIsValid){

				//lookup the user from the filesystem
				dataLib.read('users',email, (err, storedUserData) => {
					
					if(!err && storedUserData){

						//REMOVE user
						dataLib.delete('users', email, (err) => {

							if(!err){
								callback(200, {'Success!' : 'User deleted successfully'})
							}else{
								callback(500, {'Error' :'Couldnt delete this user for some odd reason'})
							}

						})
					}else{
						//NOT FOUND USER
						callback(400, {'Error': 'Couldnt Find user'})
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

module.exports = doUsers;