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
	console.log('phoneNumber')
	console.log(phoneNumber)

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
routeHandlers.doTokens.post = (data, callback) => {

}

//Tokens get
routeHandlers.doTokens.get = (data, callback) => {
	
}

//Tokens put
routeHandlers.doTokens.put = (data, callback) => {
	
}

//Tokens delete
routeHandlers.doTokens.delete = (data, callback) => {
	
}


module.exports = routeHandlers;