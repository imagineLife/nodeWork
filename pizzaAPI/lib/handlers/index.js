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
const { 
	indexHandler, 
	accountCreateHandler, 
	accountEditHandler,
	sessionCreateHandler,
	sessionDeletedHandler,
	checkoutHandler,
	cartViewHandler,
	menuHandler 
} = require('./frontend/index');

/*
	API Handlers
*/
let routeHandlers = {}
routeHandlers.doUsers = doUsers;
routeHandlers.doTokens = doTokens;
routeHandlers.doMenuItems = doMenuItems;
routeHandlers.doCart = doCart;
routeHandlers.doCharges = doCharges;

/*
	Frontend Handlers
*/
routeHandlers.doIndex = indexHandler;
routeHandlers.accountCreate = accountCreateHandler;
routeHandlers.accountEdit = accountEditHandler;
routeHandlers.sessionCreate = sessionCreateHandler;
routeHandlers.sessionDeleted = sessionDeletedHandler;
routeHandlers.menu = menuHandler;
routeHandlers.cartView = cartViewHandler;
routeHandlers.checkout = checkoutHandler;

//USERS handler
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

	helpers.getContentFromAsset= (asst) => {
		//default content-type
		let contentType = 'plain';

		//conditional content-type
		if(asst.indexOf('.css') > -1){
			contentType = 'css'
		}
		if(asst.indexOf('.png') > -1){
			contentType = 'png'
		}
		if(asst.indexOf('.jpg') > -1){
			contentType = 'jpg'
		}
		if(asst.indexOf('.ico') > -1){
			contentType = 'favicon'
		}

		return contentType;
	}

	//get the asset
	helpers.getStaticAsset(trimmedAsset, (err, assetData)=> {
		
		//error-handling
		if(err || !data){
			return cb(500)
		}

		let contentType = helpers.getContentFromAsset(trimmedAsset)

		cb(200, assetData, contentType);
	})

}

module.exports = routeHandlers;