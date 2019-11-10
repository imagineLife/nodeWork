const helpers = require('../../helpers')

const indexHandler = (data, callback) => {
	//request-method validation
	if(data.method !== 'get'){
		return callback(405, undefined, 'html')
	}
	
	let stringTemplateData = {
		'head.title': "Sall-ease Apizza",
		'head.description': 'Best Pizza On Earth',
		'body.title': "Sall-Ease",
		'body.class': 'index'
	}

	helpers.getFrontend('index', stringTemplateData, callback);

}

const accountCreateHandler = (data, callback) => {
	
	//some template data for html string interpolation
	let stringTemplateData = {
		'head.title': 'Create An Account',
		'head.description': 'Sign Up is easy, & only takes a few seconds.',
		'body.class': 'accountCreate'
	} 

	//error-handling
	if(data.method !== 'get'){
		callback(405,undefined,'html')
	}

	//fetch template
	helpers.getFrontend('accountCreate', stringTemplateData, callback)
}

const accountEditHandler = (data,callback) => {
  // Reject any request that isn't a GET
  if(data.method !== 'get'){
  	return callback(405,undefined,'html');
  }
  // Prepare data for interpolation
  var templateData = {
    'head.title' : 'Account Settings',
    'body.class' : 'accountEdit'
  };
  // Read in a template as a string
  helpers.getFrontend('accountEdit', templateData, callback)
};

const sessionCreateHandler = (data,callback) => {
  // Reject any request that isn't a GET
  if(data.method !== 'get'){
  	return callback(405,undefined,'html');
  }
  // Prepare data for interpolation
  var templateData = {
    'head.title' : 'Login to your account.',
    'head.description' : 'Please enter your email address and password to access your account.',
    'body.class' : 'sessionCreate'
  };
  // Read in a template as a string
  helpers.getFrontend('sessionCreate', templateData, callback)
};

const sessionDeletedHandler = (data,callback) => {
  // Reject any request that isn't a GET
  if(data.method !== 'get'){
  	return callback(405,undefined,'html');
  }
  // Prepare data for interpolation
  var templateData = {
    'head.title' : 'Logged Out',
    'head.description' : 'You have been logged out of your account.',
    'body.class' : 'sessionDeleted'
  };
  // Read in a template as a string
  helpers.getFrontend('sessionDeleted', templateData, callback)
};

const checkoutHandler = (data, callback) => {
	
	//some template data for html string interpolation
	let stringTemplateData = {
		'head.title': 'Checkout',
		'head.description': 'Pizza Shop Checkout',
		'body.class': 'checkout-items'
	} 

	//error-handling
	if(data.method !== 'get'){
		callback(405,undefined,'html')
	}

	helpers.getFrontend('checkout', stringTemplateData, callback)
}

const cartViewHandler = (data, callback) => {
	
	//some template data for html string interpolation
	let stringTemplateData = {
		'head.title': 'Cart',
		'head.description': 'Pizza Shop Cart Items',
		'body.class': 'cartItems'
	} 

	//error-handling
	if(data.method !== 'get'){
		callback(405,undefined,'html')
	}

	helpers.getFrontend('cart', stringTemplateData, callback)
}

const menuHandler = (data, callback) => {
	
	//some template data for html string interpolation
	let stringTemplateData = {
		'head.title': 'Menu',
		'head.description': 'Pizza Shop Menu Items',
		'body.class': 'menuItems'
	} 

	//error-handling
	if(data.method !== 'get'){
		callback(405,undefined,'html')
	}

	//fetch template
	helpers.getFrontend('menu', stringTemplateData, callback)
}

module.exports = {
	indexHandler, 
	accountCreateHandler,
	accountEditHandler, 
	sessionCreateHandler,
	sessionDeletedHandler,
	checkoutHandler,
	cartViewHandler,
	menuHandler
}