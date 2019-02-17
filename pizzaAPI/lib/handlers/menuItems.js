//dependencies
const dataLib = require('../data')
const doTokens = require('./tokens')


/*
	Get Menu Items Handling
*/

let doMenuItems = {};

doMenuItems.get = (data, callback) => {
	//TEST this by using postman with
	// http://localhost:3000/menuItems?email=jajo@gmail.com
	// should return the menuItem object
	let dataEmail = data.queryStrObj.email;
	//check that email is valid
	const email = typeof(dataEmail) == 'string' && dataEmail.includes('@') && dataEmail.includes('.com') ? dataEmail.trim() : false;
	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	if(email && passedToken){

		//verify the token matches
		doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {

			if(tokenIsValid){
			
				//lookup the menuItems from the filesystem
				dataLib.read('menuItems','menuItems', (err, menuItems) => {
			
					if(!err && menuItems){
						callback(200, menuItems)
					}else{
						callback(403, {'Error' : 'no menu items OR error'})
					}
				})
			}else{
				callback(403, {'Error': 'Non-Matching user token'})
			}
		})

	}else{
		callback(400, {'Error': 'Specified token NOT there'})
	}
}

module.exports = doMenuItems;