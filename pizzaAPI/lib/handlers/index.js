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
const doMenuItems = require('./menuItems')

//request data checker fn
function checkForLengthAndType(data){
	let res = typeof(data) == 'string' && data.trim().length > 0 ? data.trim() : false;
	return res
}

//handlers
let routeHandlers = {}
routeHandlers.doUsers = doUsers;
routeHandlers.doTokens = doTokens;
routeHandlers.doMenuItems = doMenuItems;

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
	USER CART handling
*/
routeHandlers.cart = {}
module.exports = routeHandlers;