/*
	HANLDERS - 
	a lookup-table of request handlers
*/

//Dependencies
const dataLib = require('../data')
const helpers = require('../helpers')
const config = require('../config')

//handlers from sibling handler files
const doUsers = require('./api/users');
const doTokens = require('./api/tokens')
const doMenuItems = require('./api/menuItems')
const doCart = require('./api/cart')
const doCharges = require('./api/charge')
const doIndex = require('./frontend/index')
// const doCharges = require('../../chargeHelp')

//handlers
let routeHandlers = {}
routeHandlers.doUsers = doUsers;
routeHandlers.doTokens = doTokens;
routeHandlers.doMenuItems = doMenuItems;
routeHandlers.doCart = doCart;
routeHandlers.doCharges = doCharges;

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
		return callback(405)
	}
}



routeHandlers.notFound = function(data, callback){
	callback(404)
}

//TOKENS handler
//FIGURES OUT wthe req method, & passes it to sub-handlers
routeHandlers.tokens = (data, callback) => {
	const acceptableMethods = ['post','get','put','delete'];

	if(acceptableMethods.indexOf(data.method) > -1){
		routeHandlers.doTokens[data.method](data,callback);
	}else{
		return callback(405)
	}
}


//Menu handler
//FIGURES OUT wthe req method, & passes it to sub-handlers
routeHandlers.menuItems = (data, callback) => {

	//only allow GET of menu items
	const acceptableMethods = ['get'];

	if(acceptableMethods.indexOf(data.method) > -1){
		routeHandlers.doMenuItems[data.method](data,callback);
	}else{
		return callback(405)
	}
}

// USER CART handling
//FIGURES OUT wthe req method, & passes it to sub-handlers
routeHandlers.cart = (data, callback) => {
	const acceptableMethods = ['post', 'get', 'put', 'delete'];

	if(acceptableMethods.indexOf(data.method) > -1){
		routeHandlers.doCart[data.method](data, callback);
	}

}

// CHARGES handling
//FIGURES OUT wthe req method, & passes it to sub-handlers
routeHandlers.charge = (data, callback) => {
	const acceptableMethods = ['post'];

	if(acceptableMethods.indexOf(data.method) > -1){
		routeHandlers.doCharges[data.method](data, callback);
	}

}

/*
	Frontend Handlers
*/
routeHandlers.doIndex = (data, callback) => {
	callback(undefined, undefined, 'html')
}
module.exports = routeHandlers;