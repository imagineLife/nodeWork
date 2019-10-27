//dependencies
const dataLib = require('../../data')
const doTokens = require('./tokens')


let doMenuItems = {};

//TEST this by using postman with
	// http://localhost:3000/menuItems?email={emailHere}
	// should return the menuItem object
doMenuItems.get = (data, callback) => {

	let dataEmail = data.queryStrObj.email;
	//check that email is valid
	const email = typeof(dataEmail) == 'string' && dataEmail.includes('@') && dataEmail.includes('.com') ? dataEmail.trim() : false;
	//GET token from headers
	const passedToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;

	if(!email || !passedToken){
		callback(400, {'Error': 'Specified token NOT there'})
		return
	}

	//verify the token matches
	doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {

		if(!tokenIsValid){
			callback(403, {'Error': 'Non-Matching user token'})
			return;
		}
		
		let items;
		try{
			//lookup the menuItems from the filesystem
			items = dataLib.readSync('menuItems','menuItems');
			return callback(200, {'MenuItems': JSON.parse(items)})
		}
		catch(err){
			return callback(403, {'Error': err.code});
		}
	})
}

module.exports = doMenuItems;