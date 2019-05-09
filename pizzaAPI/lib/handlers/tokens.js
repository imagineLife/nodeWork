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
//REQd data - email, pw
//a user creating a  token to use later
//NO optional data
doTokens.post = (data, callback) => {
	let dataEmail = data.payload.email
	//parse email & pw
	const eml = typeof(dataEmail) == 'string' && dataEmail.includes('@') && dataEmail.includes('.com') ? dataEmail.trim() : false;
	const pw = checkForLengthAndType(data.payload.passWord);

	if(eml && pw){

		//lookup user who matches the phoneNumber
		dataLib.read('users', eml, (err, userData) => {

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
						email: eml,
						tokenId: tokenId,
						expires: expDate,
						stripeID: userData.stripeID || null
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
doTokens.get = (data, callback) => {

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
doTokens.put = (data, callback) => {
	
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
doTokens.delete = (data, callback) => {
	
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
doTokens.verifyTokenMatch = function(tokenID,givenEmailAddr,callback){

	//read the token by id
	dataLib.read('tokens',tokenID, (err, storedTokenData) => {
		if(!err && storedTokenData){
			//Check that the tokenID MATCHES the given user AND has not expired
			if(storedTokenData.email == givenEmailAddr && storedTokenData.expires > Date.now()){
				callback(true)
			}else{
				callback(false)
			}
		}else{
			callback(false)
		}
	})
}

module.exports = doTokens;