/*
	HANLDERS - 
	a lookup-table of request handlers
*/

//Dependencies
const dataLib = require('./data')
const helpers = require('./helpers')

//request data checker fn
function checkForLengthAndType(data){
	let res = typeof(data) == 'string' && data.trim().length > 0 ? data.trim() : false;
	return res
}

//handlers
let routeHandlers = {}

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
							console.log('create user error')
							console.log(err)
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
							console.log('err!')
							console.log(err)
							ccallback(500, {'Error': 'Couldnt update this user with this info'})
						}

					})


				//if error or no data for that file
				}else{
					callback(400, {'Error': 'No data or file exists for that'})
				}
			})

		//if no other field is present to update
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
		callback(400, {'Error': 'Seems like Missing phoneNumber field'})
	}
	
}

//Users DELETE
//ONLY let auth'd users delete
//DONT let them delete OTHERS' accts
//CLEANUP other data files associated with this user
routeHandlers.doUsers.delete = function(data,callback){
	console.log('starting routeHandler doUsers.delete')
	console.log('- - - - -')
	
	//check that phone is valid
	const phoneNumber = typeof(data.queryStrObj.phoneNumber) == 'string' && data.queryStrObj.phoneNumber.trim().length == 10 ? data.queryStrObj.phoneNumber.trim() : false;

	//if phone is valid
	if(phoneNumber){
		console.log('IS phone Number')

		//lookup the user from the filesystem
		dataLib.read('users',phoneNumber, (err, storedUserData) => {
			console.log('READ userData')
			console.log(storedUserData)
			
			if(!err && storedUserData){

				//REMOVE user
				dataLib.delete('users', phoneNumber, (err) => {
					console.log('IN err fn of dataLib.delete')
					console.log('the err...')
					console.log(err)
					console.log('- - - - -')

					if(!err){
						callback(200, {'DELETED': 'Successfully'})
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

	if(!pn || !pw){
		return callback(400,{'Error': 'Missing phone or pw'})
	}

	//lookup user who matches the phoneNumber
	dataLib.read('users', pn, (err, userData) => {

		//sanity check response
		if(err || userData == 'undefined'){
			return callback(400, {'Error': 'Couldnt find that user by phoneNumber'})
		}

		//hash pw to compare to STORED hashed pw
		const hashedPW = helpers.hash(pw);

		//check if hashed pw is same as SAVED hashed pw
		if(hashedPW !== userData.hashedPW){
			return callback(400, {'Error': 'PW did not match the stored pw'})
		}

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
			
			if(err){
				return callback(500, {'Error' : 'Couldnt create new token'});
			}

			return callback(200, tokenObj)
		})
	})
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
	if(!id || id == 'undefined'){
		return callback(400, {'Error': 'Seems like incorrect token id'})
	}

	//lookup the user from the filesystem
	dataLib.read('tokens',id, (err, storedTokenData) => {
		
		if(err || !storedTokenData){
			//NOT FOUND USER
			return callback(404)
		}

		//REMOVE hashed pw from the user object before showing the user
		callback(200, storedTokenData);
	})
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

			if(err || !tokenData){
				return callback(400, {'Error': 'Specified token NOT there'})
			}
			
			let notExpired = tokenData.expires > Date.now()
			//check for EXPIRED token
			if(!notExpired){
				return callback(400, {'Error': 'The token has already expired & cannot be extended'})
			}

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
		})

	}else{
		callback(400, {'Error':'missing id or extendTrueVal'})
	}

}

//Tokens delete
routeHandlers.doTokens.delete = (data, callback) => {
	
}


module.exports = routeHandlers;