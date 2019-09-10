//dependencies
const dataLib = require('../data')
const helpers = require('../helpers')
const u = require('util')
const debug = u.debuglog('TOKENS')

//request data checker fn
function checkForLengthAndType(data){
	let res = typeof(data) == 'string' && data.trim().length > 0 ? data.trim() : false;
	return res
}

//container for all tokens methods
let doTokens = {};


//Tokens post
//REQd data - phone, pw
//a user creating a  token to use later
//NO optional data
doTokens.post = (data, callback) => {
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
doTokens.get = (data, callback) => {

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
		return callback(200, storedTokenData);
	})
}

/*
	Tokens put
	Requires ID & extend=boolean
	NO optional data
*/
doTokens.put = (data, callback) => {
	
	//get id & extend boolean from payload
	const tokenID = typeof(data.payload.token) == 'string' && data.payload.token.trim().length == 19 ? data.payload.token.trim() : false;
	// const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

	// if(!tokenID || !(extend == true)){
	if(!tokenID){		
		return callback(400, {'Error':'missing token'})
	}

	//lookup token based on id
	dataLib.read('tokens',tokenID, (err,tokenData) => {

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
		dataLib.update('tokens', tokenID, tokenData, (err) => {

			if(err){
			  return callback(500, {'Error': 'Couldnt update the token exp for some reason'})
			}

			return callback(200, {"Success": "Check Updated"})
		})
	})
}

//Tokens delete
//required: id
//optional: NONE
doTokens.delete = (data, callback) => {
	
	//check that id is valid
	const id = typeof(data.queryStrObj.id) == 'string' && data.queryStrObj.id.trim().length == 19 ? data.queryStrObj.id.trim() : false;

	//if id is valid
	if(!id){
		return callback(400, {'Error': 'Seems like Missing id field'})
	}

	//lookup the token from the filesystem
	dataLib.read('tokens',id, (err, storedUserData) => {
		
		//sanity check the token/user data
		if(err || !storedUserData){
			return callback(400, {'Error': 'Couldnt Find token by id'})
		}

		//REMOVE user
		dataLib.delete('tokens', id, (err) => {

			if(err){
				return callback(500, {'Error' :'Couldnt delete this user for some odd reason'})
			}

			return callback(200, {'DELETED': 'Successfully'})
		})
	})
}


//VERIFY that a given tokenID MATCHES a given user
doTokens.verifyTokenMatch = function(tokenID,phoneNumber,callback){
	
	//read the token by id
	dataLib.read('tokens',tokenID, (err, storedTokenData) => {

		//sanity-checking
		if(err || !storedTokenData){
			return callback(false)
		}

		const tokenStillValid = storedTokenData.expires > Date.now();

		//Check that the tokenID MATCHES the given user AND has not expired
		if((storedTokenData.phone !== phoneNumber) || (tokenStillValid !== true)){
			return callback(false)
		}

		return callback(true)

	})
}

module.exports = doTokens;