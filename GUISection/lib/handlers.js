/*
	HANLDERS - 
	a lookup-table of request handlers
*/

//Dependencies
const dataLib = require('./data')
const helpers = require('./helpers')
const config = require('./config')

//request data checker fn
function checkForLengthAndType(data){
	let res = typeof(data) == 'string' && data.trim().length > 0 ? data.trim() : false;
	return res
}

//handlers
let routeHandlers = {}


//'index' handler
routeHandlers.index = (data, callback) => {

	let stringTemplateData; 

	//error-handling
	if(data.method !== 'get'){
		callback(405,undefined,'html')
	}

	//fetch template
	helpers.getTemplate('index', stringTemplateData, (err, resStr) => {
		
		//error-handling
		if(!(!err && resStr)){
			callback(500, undefined, 'html')
		}
			
			//some template data for html string interpolation
		stringTemplateData = {
			'head.title': 'Demo Title',
			'head.description': 'demo meta description',
			'body.title': 'demo body title',
			'body.class': 'demo-body-class'
		}

		helpers.addHeaderFooter(resStr, stringTemplateData, (err, resultStr) => {

			//error-handling
			if(err || !resultStr){
				return callback(500, undefined, 'html')
			}

			return callback(200, resultStr, 'html')
		})

	})
}

// Favicon handler
routeHandlers.favicon = (data, cb) => {
	
	//error-handling
	if(data.method !== 'get'){
		return cb(405)
	}

	//get the asset
	helpers.getStaticAsset('favicon.ico', (err, assetData) => {
		
		//error-handling
		if(err || !data){
			return cb(500)
		}

		cb(200, assetData, 'favicon')

	})
}

// public asset handler
routeHandlers.public = (data, cb) => {

	
	
	//method checking
	if(data.method !== 'get'){
		return cb(405)
	}

	//get just the file-name
	const trimmedAsset = data.trimmedPath.replace('public/','').trim()
	
	//sanity check the asset name
	if(!(trimmedAsset.length > 0)){
		return cb(404)
	}

	//get the asset
	helpers.getStaticAsset(trimmedAsset, (err, assetData)=> {
		
		//error-handling
		if(err || !data){
			return cb(500)
		}

		//default content-type
		let contentType = 'plain';

		//conditional content-type
		if(trimmedAsset.indexOf('.css') > -1){
			contentType = 'css'
		}
		if(trimmedAsset.indexOf('.png') > -1){
			contentType = 'png'
		}
		if(trimmedAsset.indexOf('.jpg') > -1){
			contentType = 'jpg'
		}
		if(trimmedAsset.indexOf('.ico') > -1){
			contentType = 'favicon'
		}

		cb(200, assetData, contentType);
	})

}

//USERS handler
//FIGURES OUT wthe req method, & passes it to sub-handlers
routeHandlers.users = (data, callback) => {
	const acceptableMethods = ['post','get','put','delete'];

	/*
		if the method from the Front-End matches an acceptable method,
		run it. use a NEW SET OF METHODS 'doUser'.
		ELSE return 40
	*/
	if(acceptableMethods.indexOf(data.method) > -1){
		routeHandlers.doUsers[data.method](data,callback);
	}else{
		callback(405)
	}
}

//deals with users CRUD methods
routeHandlers.doUsers = {}

//Users POST
//REQ FIELDS: first, last, phone, pw, tosAgreement, NO optional Data
routeHandlers.doUsers.post = function(data,callback){
	
	//GET all req'd fields from request payload
	const dataPhone = data.payload.phoneNumber
	const dataTos = data.payload.tosAgreement

	//check that all req'd fields exist
	const fn = checkForLengthAndType(data.payload.firstName)
	const ln = checkForLengthAndType(data.payload.lastName)
	const pn = typeof(dataPhone) == 'string' && dataPhone.trim().length == 10 ? dataPhone.trim() : false;
	const pw = checkForLengthAndType(data.payload.passWord)
	const tosAg = typeof(dataTos) == 'boolean' && dataTos == true ? true : false;


	//continue is fall reqd fields are present
	if(fn && ln && pn && pw && tosAg){

		/*
			make sure that user doesn't already exist
			USING the CRUD handlers from the data directory as a dependence above
			READ from users data using this data
		*/

		//check if user phoneNumber already exists
		//takes dir, fileName,callback
		dataLib.read('users', pn, (err,result) => {

			//if it comes back with an error,
			// that means there IS no phone number
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
						phone: pn,
						hashedPW: hashedPW,
						tosAgreement: true
					}

					//STORE this user to disk
					//create method takes dir,fileName,data,callback
					dataLib.create('users',pn,userObj,(err) => {
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
				callback(400,{'Error': 'A User with that number already exists'})
			}
		})

	
	}else{
	//THROW ERROR if payload doesn't contain req'd fields
		callback(400,{'Error': 'Missing Reqd fields'})
	}

}

//Users PUT
//req phonenumber
//OPTIONAL - firstName, lastName, pw (at least ONE MUST be specified)
//@TODO only let auth user update their own obj. don't let them update others

routeHandlers.doUsers.put = function(data,callback){
	
	//check that the phoneNumber is value
	const phoneNumber = typeof(data.payload.phoneNumber) == 'string' && data.payload.phoneNumber.trim().length == 10 ? data.payload.phoneNumber.trim() : false;

	//check for optional fields
	const fn = checkForLengthAndType(data.payload.firstName)
	const ln = checkForLengthAndType(data.payload.lastName)
	const pw = checkForLengthAndType(data.payload.passWord)

	//if phone number exists, keep going
	if(phoneNumber){

		//if at least one other field exists to update
		if(fn || ln || pw){

			//GET token from headers
			const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

			//verify that token is valid for passed phoneNumber
			routeHandlers.doTokens.verifyTokenMatch(passedToken, phoneNumber, (tokenIsValid) => {
				if(tokenIsValid){

					//lookup the user
					dataLib.read('users', phoneNumber, (err, userData) => {
						
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
							dataLib.update('users', phoneNumber, userData, (err) => {

								if(!err){
									callback(200)
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
routeHandlers.doUsers.get = function(data,callback){

	//TEST this by using postman with
	// http://localhost:3000/users?phoneNumber=1238675309
	// should return the user object

	//check that the phoneNumber is value
	const phoneNumber = typeof(data.queryStrObj.phoneNumber) == 'string' && data.queryStrObj.phoneNumber.trim().length == 10 ? data.queryStrObj.phoneNumber.trim() : false;

	//if phone is valid
	if(phoneNumber){

		//GET token from headers
		const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		//verify that token is valid for passed phoneNumber
		routeHandlers.doTokens.verifyTokenMatch(passedToken, phoneNumber, (tokenIsValid) => {

			//IF token MATCHES phoneNumber
			if(tokenIsValid){

				//lookup the user from the filesystem
				dataLib.read('users',phoneNumber, (err, storedUserData) => {
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
		callback(400, {'Error': 'Seems like Missing phoneNumber field'})
	}
	
}

//Users DELETE
//ONLY let auth'd users delete
//DONT let them delete OTHERS' accts
//CLEANUP other data files associated with this user
routeHandlers.doUsers.delete = function(data,callback){
	
	//check that phone is valid
	const phoneNumber = typeof(data.queryStrObj.phoneNumber) == 'string' && data.queryStrObj.phoneNumber.trim().length == 10 ? data.queryStrObj.phoneNumber.trim() : false;

	//if phone is valid
	if(phoneNumber){

		//GET token from headers
		const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		//verify that token is valid for passed phoneNumber
		routeHandlers.doTokens.verifyTokenMatch(passedToken, phoneNumber, (tokenIsValid) => {
			if(tokenIsValid){

				//lookup the user from the filesystem
				dataLib.read('users',phoneNumber, (err, storedUserData) => {
					
					if(!err && storedUserData){

						//REMOVE user
						dataLib.delete('users', phoneNumber, (err) => {

							if(!err){
								
								//Delete users-associated checks
								//get checks form userData
								let userChecks = typeof(storedUserData.checks) == 'object' && storedUserData.checks instanceof Array ? storedUserData.checks : [];
								const noOfChecks = userChecks.length;
								
								if(noOfChecks > 0){

									let checksDeleted = 0;
									let deleteErrs = false;
									userChecks.forEach(check => {
										dataLib.delete('checks', check, (err) => {
											if(err){
												deleteErrs = true;
											}
											checksDeleted++;
											if(checksDeleted == noOfChecks){
												if(!deleteErrs){
													callback(200)
												}else{
													callback(500, {'Err': 'Did not delete ALL checks: some checks may still be present associated with user.'})
												}
											}
										})
									})

								}else{
									callback(200)
								}

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
		callback(400, {'Error': 'Seems like Missing phoneNumber field'})
	}
}

//ping handler
routeHandlers.ping = function(data, callback){
	callback(200)
}

routeHandlers.notFound = function(data, callback){
	callback(404)
}



//TOKENS handler
//FIGURES OUT wthe req method, & passes it to sub-handlers
routeHandlers.tokens = (data, callback) => {
	const acceptableMethods = ['post','get','put','delete'];

	/*
		if the method from the Front-End matches an acceptable method,
		run it. use a NEW SET OF METHODS 'doTokens'.
		ELSE return 40
	*/
	if(acceptableMethods.indexOf(data.method) > -1){
		routeHandlers.doTokens[data.method](data,callback);
	}else{
		callback(405)
	}
}


//container for all tokens methods
routeHandlers.doTokens = {};


//Tokens post
//REQd data - phone, pw
//a user creating a  token to use later
//NO optional data
routeHandlers.doTokens.post = (data, callback) => {
	let dataPhone = data.payload.phoneNumber
	//parse phone & pw
	const pn = typeof(dataPhone) == 'string' && dataPhone.trim().length == 10 ? dataPhone.trim() : false;
	const pw = checkForLengthAndType(data.payload.passWord);

	if(pn && pw){

		//lookup user who matches the phoneNumber
		dataLib.read('users', pn, (err, userData) => {

			if(!err && userData){

				//hash pw to compare to STORED hashed pw
				const hashedPW = helpers.hash(pw);

				//check if hashed pw is same as SAVED hashed pw
				if(hashedPW == userData.hashedPW){

					//create new TOKEN for this user
					const tokenId = helpers.createRandomString(20);

					//set exp date 1 hour in the future
					const expDate = Date.now() + 1000 * 60 * 60;

					//store the tokenId as a 'token Object'
					const tokenObj = {
						phone: pn,
						tokenId: tokenId,
						expires: expDate
					}

					//store the tokenObj
					//NAME the file the tokenID
					dataLib.create('tokens', tokenId, tokenObj, (err) => {
						if(!err){
							callback(200, tokenObj)
						}else{
							callback(500, {'Error' : 'Couldnt create new token'})
						}
					})

				}else{
					callback(400, {'Error': 'PW did not match the stored pw'})
				}

			}else{
				callback(400, {'Error': 'Couldnt find that user by phoneNumber'})
			}

		})

		//match the user against the pw

	}else{
		callback(400,{'Error': 'Missing phone or pw'})
	}

}

//Tokens get
//reqd data is ID
//NO opt data
routeHandlers.doTokens.get = (data, callback) => {

	//TEST this by using postman with
	// http://localhost:3000/users?phoneNumber=1238675309
	// should return the user object

	//check that the ID is value
	const id = typeof(data.queryStrObj.id) == 'string' && data.queryStrObj.id.trim().length == 19 ? data.queryStrObj.id.trim() : false;

	//if id is valid
	if(id){

		//lookup the user from the filesystem
		dataLib.read('tokens',id, (err, storedTokenData) => {
			
			if(!err && storedTokenData){

				//REMOVE hashed pw from the user object before showing the user
				callback(200, storedTokenData);

			}else{

				//NOT FOUND USER
				callback(404)
			}
		})

	}else{	
		callback(400, {'Error': 'Seems like incorrect token id'})
	}

}

/*
	Tokens put
	Requires ID & extend=boolean
	NO optional data
*/
routeHandlers.doTokens.put = (data, callback) => {
	
	//get id & extend boolean from payload
	const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 19 ? data.payload.id.trim() : false;
	const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

	if(id && (extend == true)){

		//lookup token based on id
		dataLib.read('tokens',id, (err,tokenData) => {

			if(!err && tokenData){

				//check for EXPIRED token
				if(tokenData.expires > Date.now()){

					//set expiration of the token an hour from now
					tokenData.expires = Date.now()  + 1000 * 60 * 60;

					//store the new token data
					dataLib.update('tokens', id, tokenData, (err) => {

						if(!err){
							callback(200)
						}else{
							callback(500, {'Error': 'Couldnt update the token exp for some reason'})
						}

					})

				}else{
					callback(400, {'Error': 'The token has already expired & cannot be extended'})
				}


			}else{
				callback(400, {'Error': 'Specified token NOT there'})
			}

		})

	}else{
		callback(400, {'Error':'missing id or extendTrueVal'})
	}

}

//Tokens delete
//required: id
//optional: NONE
routeHandlers.doTokens.delete = (data, callback) => {
	
	//check that id is valid
	const id = typeof(data.queryStrObj.id) == 'string' && data.queryStrObj.id.trim().length == 19 ? data.queryStrObj.id.trim() : false;

	//if id is valid
	if(id){

		//lookup the token from the filesystem
		dataLib.read('tokens',id, (err, storedUserData) => {
			
			if(!err && storedUserData){

				//REMOVE user
				dataLib.delete('tokens', id, (err) => {

					if(!err){
						callback(200, {'DELETED': 'Successfully'})
					}else{
						callback(500, {'Error' :'Couldnt delete this user for some odd reason'})
					}

				})
			}else{
				//NOT FOUND USER
				callback(400, {'Error': 'Couldnt Find token by id'})
			}
		})

	}else{	
		callback(400, {'Error': 'Seems like Missing id field'})
	}

}


//VERIFY that a given tokenID MATCHES a given user
routeHandlers.doTokens.verifyTokenMatch = function(tokenID,givenPhoneNumber,callback){

	//read the token by id
	dataLib.read('tokens',tokenID, (err, storedTokenData) => {
		if(!err && storedTokenData){
			//Check that the tokenID MATCHES the given user AND has not expired
			if(storedTokenData.phone == givenPhoneNumber && storedTokenData.expires > Date.now()){
				callback(true)
			}else{
				callback(false)
			}
		}else{
			callback(false)
		}
	})
}

//checks handler
//FIGURES OUT wthe req method, & passes it to sub-handlers
routeHandlers.checks = (data, callback) => {
	const acceptableMethods = ['post','get','put','delete'];

	/*
		if the method from the Front-End matches an acceptable method,
		run it. use a NEW SET OF METHODS 'doUser'.
		ELSE return 40
	*/
	if(acceptableMethods.indexOf(data.method) > -1){
		routeHandlers.doChecks[data.method](data,callback);
	}else{
		callback(405)
	}
}


//CHECKS methods container
routeHandlers.doChecks = {};


/*
	CHECKS post
	reqd: 
		PROTOCOL (http/https), 
		URL to check, 
		METHOD to check,
		successCodes -> arr of #s to treat as success (200 or 201)
		reqd timeout in sec. before considered down
	optional:
		none

*/
routeHandlers.doChecks.post = (data, callback) => {

	//check if protocall is in post data
	var sentProtocol = typeof(data.payload.protocol) == 'string' && ['http','https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
	var sentUrl = typeof(data.payload.url) == 'string' && data.payload.url.length > 0 ? data.payload.url : false;
	var sentMethod = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
	var sentSuccessCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
	var sentTimeout = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

	if(sentProtocol && sentUrl && sentMethod && sentSuccessCodes && sentTimeout){

		//get & check if user sent a valid token
		const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		//lookup the user by reading the token
		dataLib.read('tokens', passedToken, (err, tokenData) => {
			if(!err && tokenData){

				//get users phone Number from token data
				const tokenPhone = tokenData.phone;

				//lookup user data by phone#
				dataLib.read('users', tokenPhone, (err, userData) => {
					if(!err && userData){

						//get checks form userData
						const userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

						//verify that the user has LESS than maxChecks from config
						if(userChecks.length < config.maxChecks){

							//CREATE new check
							//rndm ID
							const rndmID = helpers.createRandomString(20);

							const checkObj = {
								id: rndmID,
								userPhone: tokenPhone,
								protocol: sentProtocol,
								url: sentUrl,
								method: sentMethod,
								successCodes: sentSuccessCodes,
								timeoutSeconds: sentTimeout
							};

							//save checks to disk
							dataLib.create('checks', rndmID, checkObj, (err) => {
								if(!err){

									//add the checkID to the USER obj
									userData.checks = userChecks
									userData.checks.push(rndmID)

									//SAVE the new checks to userData
									dataLib.update('users', tokenPhone, userData, (err) => {
										if(!err){

											//return data to requester
											callback(200, checkObj)

										}else{
											callback(500, {'Error': 'couldnt update the user with this check'})
										}
									})

								}else{
									callback(500, {'Error': 'couldnt create check'})
								}
							})

						}else{
							callback(400, {'Error': `User has max number of checks: ${config.maxChecks}`})
						}
					}else{
						callback(403)
					}
				})

			}else{
				callback(403)
			}
		})

	}else{
		callback(400, {'Error': 'Missing reqd inputs or invalid inputs'})
	}
}

//
routeHandlers.doChecks.get = (data, callback) => {

	//TEST this by using postman with
	// http://localhost:3000/checks?id=checkIdHere
	// should return the user object

	//check that the ID is value
	const passedID = typeof(data.queryStrObj.id) == 'string' && data.queryStrObj.id.trim().length == 19 ? data.queryStrObj.id.trim() : false;

	if(passedID){

		//LOOKUP the check
		dataLib.read('checks', passedID, (err, checkData) => {

			if(!err && checkData){

				//GET token from headers
				const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

				//verify that token is valid for user who created the check
				routeHandlers.doTokens.verifyTokenMatch(passedToken, checkData.userPhone, (tokenIsValid) => {

					//IF token MATCHES passedID
					if(tokenIsValid){

						//return check data
						callback(200, checkData)

					}else{
						callback(403)
					}

				})

			}else{
				callback(404)
			}
		})

	}else{
		callback(403, {'Error': 'Invalid ID from client'})
	}

}

/*
	CHECKS PUT
	reqd: check id
	opt: protcol, url, method, successCodes, timeoutSeconds, AT LEAST ONE OF THESE
*/
routeHandlers.doChecks.put = (data, callback) => {
	//check that the phoneNumber is value
	const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 19 ? data.payload.id.trim() : false;

	//check for optional fields
	var sentProtocol = typeof(data.payload.protocol) == 'string' && ['http','https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
	var sentUrl = typeof(data.payload.url) == 'string' && data.payload.url.length > 0 ? data.payload.url : false;
	var sentMethod = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
	var sentSuccessCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
	var sentTimeout = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;


	//if phone number exists, keep going
	if(id){

		//if at least one other field exists to update
		if(sentProtocol || sentUrl || sentMethod || sentSuccessCodes || sentTimeout){

			//lookup the user
			dataLib.read('checks', id, (err, checkData) => {
				
				//check if file is error-less AND has userdata
				if(!err && checkData){

					//GET CHEKC from headers
					const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

					//verify that token is valid for passed phoneNumber
					routeHandlers.doTokens.verifyTokenMatch(passedToken, checkData.userPhone, (tokenIsValid) => {
						if(tokenIsValid){

							//update the field in the userData 
							if(sentProtocol){
								checkData.sentProtocol = sentProtocol;
							}
							if(sentUrl){
								checkData.url = sentUrl;
							}
							if(sentMethod){
								checkData.method = sentMethod;
							}
							if(sentSuccessCodes){
								checkData.successCodes = sentSuccessCodes;
							}
							if(sentTimeout){
								checkData.timeout = sentTimeout;
							}

							//Store the newly updated userData obj
							dataLib.update('checks', id, checkData, (err) => {

								if(!err){
									callback(200)
								}else{
									callback(500, {'Error': 'Couldnt update this checkData with this info'})
								}

							})

								}else{
									callback(403, {'Error': 'Missing required token in header, or token invalid'})
								}

							})

				//if error or no data for that file
				}else{
					callback(400, {'Error': 'No data or file exists for that'})
				}
			})


		}else{
			callback(400, {'Error': 'Missing an updatable field'})
		}

	//if phone is invalid, Error 
	}else{
		callback(400, {'Error': 'Missing reqd ID field'})
	}

};

//DELETE CHECK
routeHandlers.doChecks.delete = function(data,callback){
	
	//check that id is valid
	const deletingCheckID = typeof(data.queryStrObj.id) == 'string' && data.queryStrObj.id.trim().length == 19 ? data.queryStrObj.id.trim() : false;

	//if id is valid
	if(deletingCheckID){

		//lookup the check
		dataLib.read('checks', deletingCheckID, (err, checkData) => {
			if(!err && checkData){

				//GET token from headers
				const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

				//verify that token is valid for passed id
				routeHandlers.doTokens.verifyTokenMatch(passedToken, checkData.userPhone, (tokenIsValid) => {
					if(tokenIsValid){

						//delete check data
						dataLib.delete('checks', deletingCheckID, (err) => {
							if(!err){

								//Lookup user, remove check from thier user data
								dataLib.read('users', checkData.userPhone, (err, userData) => {
									if(!err && userData){

										//get users checks data
										const userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

										//remove the check from their checks
										var checkPos = userChecks.indexOf(deletingCheckID)
										if(checkPos > -1){
											
											userChecks.splice(checkPos, 1)
											
											//re-save the users data without the check
											dataLib.update('users', checkData.userPhone, userData, (err) => {
												if(!err){
													callback(200)	
												}else{
													callback(500, {'Error': 'Couldnt update the user data'})
												}
												
											})

										}else{
											callback(500, {'err': 'Couldnt find the check, funny result'})
										}

									}else{
										callback(500, {'Error': 'Could not find the user for this check'})
									}
								})

							}else{
								callback(50, {"err": "couldnt delete check"})
							}
						})

					}else{
						callback(403, {'Error': 'Missing required token in header, or token invalid'})
					}
				})

			}else{
				callback(400, {'Error': 'This checkID didnt show up'})
			}
		})

	}else{	
		callback(400, {'Error': 'Seems like Missing id field'})
	}
}

module.exports = routeHandlers;