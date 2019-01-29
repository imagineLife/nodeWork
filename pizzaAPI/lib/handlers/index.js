/*
	HANLDERS - 
	a lookup-table of request handlers
*/

//Dependencies
const dataLib = require('../data')
const helpers = require('../helpers')
const config = require('../config')

const doUsers = require('./users');
const doTokens = require('./tokens')

//request data checker fn
function checkForLengthAndType(data){
	let res = typeof(data) == 'string' && data.trim().length > 0 ? data.trim() : false;
	return res
}

//handlers
let routeHandlers = {}
routeHandlers.doUsers = doUsers;
routeHandlers.doTokens = doTokens;

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


//Menu handler
//FIGURES OUT wthe req method, & passes it to sub-handlers
routeHandlers.menuItems = (data, callback) => {

	//only allow GET of menu items
	const acceptableMethods = ['get'];

	/*
		if the method from the Front-End matches an acceptable method,
		run it. use a NEW SET OF METHODS 'doTokens'.
		ELSE return 40
	*/
	if(acceptableMethods.indexOf(data.method) > -1){
		routeHandlers.doMenuItems[data.method](data,callback);
	}else{
		callback(405)
	}
}




/*
	Get Menu Items Handling
*/
routeHandlers.doMenuItems = {};

routeHandlers.doMenuItems.get = (data, callback) => {
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
		routeHandlers.doTokens.verifyTokenMatch(passedToken, email, (tokenIsValid) => {

			if(tokenIsValid){
				console.log('token is valid!')
				
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


/*
	USER CART handling
*/
routeHandlers.cart = {}
module.exports = routeHandlers;