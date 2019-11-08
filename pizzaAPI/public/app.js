/*
	Frontend Logic
*/

let app = {}

app.config = {
	'sessionToken': false
}

/*
	AJAX client holder, for rest api
	contains
	request
*/
app.client = {}

/*
	maker of API call
	NOTE: this can be tested in-browser
	in the browser console, via the /ping route:
	app.client.request(undefined, '/ping','GET',undefined,undefined,function(statusCode,payload){console.log('DONE!',statusCode,payload)})
*/
app.client.request = (headers, path, method, queryStrObj, payload, cb) => {
	//defaults
	headers = typeof(headers) == 'object' && headers !== null ? headers : {};
	path = typeof(path) == 'string' ? path : '/';
	method = typeof(method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
	queryStrObj = typeof(queryStrObj) == 'object' && queryStrObj !== null ? queryStrObj : {};
	payload = typeof(payload) == 'object' && payload !== null ? payload : {};
	cb = typeof(cb) == 'function' ? cb : false;

	//placeholder vals, awaiting params via the '?'
	let reqURL = `${path}?`;
	let counter = 0;

	//append queryStrObj to reqURL
	for(let qK in queryStrObj){
		if(queryStrObj.hasOwnProperty(qK)){
			counter++;

			if(counter > 1){
				reqURL += `&`;
			}

			reqURL+=qK+'='+queryStrObj[qK];
		}
	}

	//build the request
	let reqObj = new XMLHttpRequest();
	reqObj.open(method, reqURL, true);
	reqObj.setRequestHeader('Content-Type', 'application/json');

	//add each header from the passed request headers
	for(let hK in headers){
		if(headers.hasOwnProperty(hK)){
			reqObj.setRequestHeader(hK, headers[hK])
		}
	}

	//add token to header if present
	if(app.config.sessionToken){
		reqObj.setRequestHeader('token', app.config.sessionToken.tokenId)
	}

	//when the req comes back, handle response
	reqObj.onreadystatechange = () => {
		if(reqObj.readyState == XMLHttpRequest.DONE){
			let thisStatus = reqObj.status;
			let resTxt = reqObj.responseText;

			//cb if requested
			if(cb){
				try{
					let parsedRes = JSON.parse(resTxt)
					cb(thisStatus, parsedRes)
				}catch(e){
					cb(thisStatus, false)
				}
			}
		}
	}

	//SEND the payload as JSON
	let jsonStr = JSON.stringify(payload)
	reqObj.send(jsonStr)
}

/*
	Bind forms
	- STOPS the form from 'auto' submitting
	- collects form inputs into payload
	- sends form input payload to api
*/
app.bindForms = function(){
  if(document.querySelector("form")){

    var allForms = document.querySelectorAll("form");
    for(var i = 0; i < allForms.length; i++){
        allForms[i].addEventListener("submit", function(e){

        // Stop it from submitting
        e.preventDefault();

        var formId = this.id;
        if(formId == 'checksCreate'){
          app.handleCart();
        }else{
          var path = this.action;
          var method = this.method.toUpperCase();

          // Hide the error message (if it's currently shown due to a previous error)
          document.querySelector("#"+formId+" .formError").style.display = 'none';

          // Hide the success message (if it's currently shown due to a previous error)
          if(document.querySelector("#"+formId+" .formSuccess")){
            document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
          }


          // Turn the inputs into a payload
          var payload = {};
          
          var elements = this.elements;
          for(var i = 0; i < elements.length; i++){
            if(elements[i].type !== 'submit'){
              // Determine class of element and set value accordingly
              var classOfElement = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
              var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
              var elementIsChecked = elements[i].checked;
              // Override the method of the form if the input's name is _method
              var nameOfElement = elements[i].name;
              if(nameOfElement == '_method'){
                method = valueOfElement;
              } else {
                // Create an payload field named "method" if the elements name is actually httpmethod
                if(nameOfElement == 'httpmethod'){
                  nameOfElement = 'method';
                }
                // Create an payload field named "id" if the elements name is actually uid
                if(nameOfElement == 'uid'){
                  nameOfElement = 'id';
                }
                // If the element has the class "multiselect" add its value(s) as array elements
                if(classOfElement.indexOf('multiselect') > -1){
                  if(elementIsChecked){
                    payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                    payload[nameOfElement].push(valueOfElement);
                  }
                } else {
                  payload[nameOfElement] = valueOfElement;
                }

              }
            }
          }

          // If the method is DELETE, the payload should be a queryStringObject instead
          var queryStringObject = method == 'DELETE' ? payload : {};
          
          // Call the API
          app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload){
            // Display an error on the form if needed
            if(statusCode !== 200){

              if(statusCode == 403){
                // log the user out
                app.logUserOut();

              } else {

                // Try to get the error from the api, or set a default error message
                var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

                // Set the formError field with the error text
                document.querySelector("#"+formId+" .formError").innerHTML = error;

                // Show (unhide) the form error field on the form
                document.querySelector("#"+formId+" .formError").style.display = 'block';
              }
            } else {
              // If successful, send to form response processor
              app.formResponseProcessor(formId,payload,responsePayload);
            }

          });
        }
      });
    }
  }
};

// Log the user out then redirect them
app.logUserOut = function(redirectUser){
  // Set redirectUser to default to true
  // redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

  // Get the current token id
  var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

  // Send the current token to the tokens endpoint to delete it
  var queryStringObject = {
    'id' : tokenId
  };

  app.client.request(undefined,'api/tokens','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
    // Set the app.config token as false
    app.setSessionToken(false);

    // Send the user to the logged out page
    // if(redirectUser){
      window.location = '/session/deleted';
    // }

  });
};

// Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
    
  var functionToCall = false;
  // If account creation was successful, try to immediately log the user in
  if(formId == 'accountCreate'){
  
    let {email, passWord, firstName, lastName, address, tosAgreement} = requestPayload
    // Take the phone and password, and use it to log the user in
    var newPayload = {
      'email' : email,
      'passWord' : passWord,
      'firstName': firstName,
      'lastName': lastName,
      'address': address,
      'tosAgreement': tosAgreement
    };

    app.client.request(undefined,'api/tokens','POST',undefined,newPayload,function(newStatusCode,newResponsePayload){
    	
      // Display an error on the form if needed
      if(newStatusCode !== 200){

        // Set the formError field with the error text
        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

        // Show (unhide) the form error field on the form
        document.querySelector("#"+formId+" .formError").style.display = 'block';

      } else {
        // If successful, set the token and redirect the user
        app.setSessionToken(newResponsePayload);
        window.location = '/menu';
      }
    });
  }
  // If login was successful, set the token in localstorage and redirect the user
  if(formId == 'sessionCreate'){
    app.setSessionToken(responsePayload);
    window.location = '/menu';
  }

  // If forms saved successfully and they have success messages, show them
  var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2','checksEdit1'];
  if(formsWithSuccessMessages.indexOf(formId) > -1){
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }

  // If the user just deleted their account, redirect them to the account-delete page
  if(formId == 'accountEdit3'){
    app.logUserOut(false);
    window.location = '/account/deleted';
  }

  // If the user just created a new check successfully, redirect back to the dashboard
  if(formId == 'checksCreate'){
    window.location = '/cart';
  }

  // If the user just deleted a check, redirect them to the dashboard
  if(formId == 'checksEdit2'){
    window.location = '/menu';
  }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token){
  app.config.sessionToken = token;
  var tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
  if(typeof(token) == 'object'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function(){
  
  var tokenString = localStorage.getItem('token');
  if(typeof(tokenString) == 'string'){
    try{
      var token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      
      if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
        return;
      } else {
        app.setLoggedInClass(false);
        return;
      }
    }catch(e){
      app.config.sessionToken = false;
      app.setLoggedInClass(false);
      return;
    }
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add){
  var target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};

// Renew the token
app.renewToken = function(callback){
  var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  
  if(!currentToken){
    app.setSessionToken(false);
    return callback(true);
  }
  // Update the token with a new expiration
  var payload = {
    'id' : currentToken.tokenId,
    'extend' : true,
  };
  app.client.request(undefined,'api/tokens','PUT',undefined,payload,function(statusCode,responsePayload){
    // Display an error on the form if needed
    if(statusCode !== 200){
      app.setSessionToken(false);
      return callback(true);
    }
    // Get the new token details
    var queryStringObject = {'id' : currentToken.tokenId};
    app.client.request(undefined,'api/tokens','GET',queryStringObject,undefined,function(statusCode,responsePayload){
      // Display an error on the form if needed
      if(statusCode !== 200){
        app.setSessionToken(false);
        return callback(true);
      }
      app.setSessionToken(responsePayload);
      return callback(false);
    });
  });
};

// Bind the logout button
app.bindLogoutButton = function(){
  document.getElementById("logoutButton").addEventListener("click", function(e){

    // Stop it from redirecting anywhere
    e.preventDefault();

    // Log the user out
    app.logUserOut();

  });
};

// Load data on the page
app.loadDataOnPage = function(){
  // Get the current page from the body class
  var bodyClasses = document.querySelector("body").classList;
  var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  // Logic for account settings page
  if(primaryClass == 'accountEdit'){
    return app.loadAccountEditPage();
  }

  // Logic for dashboard page
  if(primaryClass == 'menuItems'){
    app.loadMenuItems();
  }

  // Logic for cart page
  if(primaryClass == 'cartItems'){
    app.loadCartItems();
  }

  // Logic for check details page
  if(primaryClass == 'checksEdit'){
    app.loadChecksEditPage();
  }
};

// Load the account edit page specifically
app.loadAccountEditPage = function(){

  // Get the email from the current token, or log the user out if none is there
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  
  if(!email){
    return app.logUserOut();
  }
  // Fetch the user data
  var queryStringObject = {
    'email' : email
  };

  app.client.request(undefined,'api/users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
    
    if(statusCode !== 200){
      // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
      return app.logUserOut();
    }
    
    
    // Put the data into the forms as values where needed
    document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
    document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;
    document.querySelector("#accountEdit1 .displayEmailInput").value = responsePayload.email;

    // Put the hidden phone field into both forms
    var hiddenPhoneInputs = document.querySelectorAll("input.hiddenEmail");
    for(var i = 0; i < hiddenPhoneInputs.length; i++){
        hiddenPhoneInputs[i].value = responsePayload.phone;
    }
  });
};

// Load the menu items
app.loadMenuItems = function(){
  
  // Get the email from the current token, or log the user out if none is there
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  if(!email){
    app.logUserOut();
    return;
  }
  // Fetch the user data
  var queryStringObject = {
    'email' : email
  };

  app.client.request(undefined,'api/menuItems','GET',queryStringObject,undefined,function(statusCode,responsePayload){
    
    if(statusCode !== 200){
      // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
      app.logUserOut();
      return;
    }
    
    // ERROR-HANLDE missing menu items
    var menuItems = responsePayload['MenuItems'];

    if(!menuItems || menuItems.length < 1){
      // Show 'you have no checks' message
      document.getElementById("noChecksMessage").style.display = 'table-row';

      // Show the createCheck CTA
      document.getElementById("goToMenu").style.display = 'block';
      return;
    }

    var table = document.getElementById("checksListTable");
    // Show each created check as a new row in the table
    menuItems.forEach(function(menuItemID){
          // Make the check data into a table row
          var tr = table.insertRow(-1);
          tr.classList.add('checkRow');
          var td0 = tr.insertCell(0);
          var td1 = tr.insertCell(1);
          var td2 = tr.insertCell(2);
          td0.innerHTML = menuItemID.name;
          td1.innerHTML = menuItemID.price;
          td2.innerHTML = `<input type="checkbox" class="multiselect intval" name="${menuItemID.id}" value="${menuItemID.name}" data-price="${menuItemID.price}">`;
    });

    // Put the hidden email field into both forms
    var hiddenPhoneInputs = document.querySelectorAll("input.hiddenEmailInput");
    for(var i = 0; i < hiddenPhoneInputs.length; i++){
        hiddenPhoneInputs[i].value = email;
    }
  });
};

// Load the menu items
app.loadCartItems = function(){

  // Get the email from the current token, or log the user out if none is there
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  if(!email){
    app.logUserOut();
    return;
  }
  // Fetch the user data
  var queryStringObject = {
    'email' : email
  };

  app.client.request(undefined,'api/cart','GET',queryStringObject,undefined,function(statusCode,responsePayload){
        
    // ERROR-HANLDE missing menu items
    var cartData = responsePayload && responsePayload['cartData'] ? responsePayload['cartData'] : null;

    //handle no-items in the cart
    if(!cartData || cartData.length < 1){
      document.getElementById("noChecksMessage").style.display = 'table-row';

      // Show the createCheck CTA
      document.getElementById("goToMenu").style.display = 'block';
      return;
    }

    //handle cart-items
    app.client.request(undefined,'api/menuItems','GET',queryStringObject,undefined,function(menuStatusCode,menuItemsResponse){
      let menu = menuItemsResponse['MenuItems']
      
      var table = document.getElementById("checksListTable");
      //make the cart item into a table-row
      cartData.forEach(function(cartItem){
          let thisCartItemName = menu.find(m => m.id === parseInt(cartItem['itemID'])).name
            var tr = table.insertRow(-1);
            tr.classList.add('checkRow');
            var td0 = tr.insertCell(0);
            var td1 = tr.insertCell(1);
            td0.innerHTML = thisCartItemName;
            td1.innerHTML = cartItem.price;
      });

        if(cartData && cartData.length > 0){
          // Show the Checkout button
          document.getElementById("checkout-button").style.display = 'block';
          return;
        }

      // // Put the hidden email field into both forms
      // var hiddenEmailInput = document.querySelectorAll("input.hiddenEmailInput");
      // for(var i = 0; i < hiddenEmailInput.length; i++){
      //     hiddenEmailInput[i].value = email;
      // }
    })
  });
};

//gets cart-items from html && prepares in expected payload layout
app.prepCart = () => {
  const checkboxes = document.getElementsByClassName("multiselect")
  // const rows = table.rows
  let cartPayload = {
    email: app.config.sessionToken.email,
    cart: []
  }
  
  for(let boxIndex = 0; boxIndex < checkboxes.length; boxIndex++){
    let checked = checkboxes[boxIndex].checked;
    if(checked){
      cartPayload.cart.push({
        itemID: checkboxes[boxIndex].name,
        count: 1,
        price: checkboxes[boxIndex].dataset.price
      })
    }
  }
  return cartPayload
}

//gather cart-handler
app.handleCart = () => {
  
  let cartPayload = app.prepCart()

  // headers, path, method, queryStrObj, payload, cb
   app.client.request(undefined,'api/cart','POST',undefined,cartPayload,function(newStatusCode,newResponsePayload){
    app.formResponseProcessor('checksCreate', cartPayload, newResponsePayload)
   })
}

// Load the checks edit page specifically
app.loadChecksEditPage = function(){
  // Get the check id from the query string, if none is found then redirect back to dashboard
  var id = typeof(window.location.href.split('=')[1]) == 'string' && window.location.href.split('=')[1].length > 0 ? window.location.href.split('=')[1] : false;
  if(!id){
    window.location = '/menu';
    return;
  }
  
  // Fetch the check data
  var queryStringObject = {
    'id' : id
  };
  app.client.request(undefined,'api/checks','GET',queryStringObject,undefined,function(statusCode,responsePayload){
    if(statusCode !== 200){
      // If the request comes back as something other than 200, redirect back to dashboard
      window.location = '/menu';
      return;
    }

    // Put the hidden id field into both forms
    var hiddenIdInputs = document.querySelectorAll("input.hiddenIdInput");
    for(var i = 0; i < hiddenIdInputs.length; i++){
        hiddenIdInputs[i].value = responsePayload.id;
    }

    let { id, state, protocol, url, method, timeoutSeconds, successCodes } = responsePayload
    // Put the data into the top form as values where needed
    document.querySelector("#checksEdit1 .displayIdInput").value = id;
    document.querySelector("#checksEdit1 .displayStateInput").value = state;
    document.querySelector("#checksEdit1 .protocolInput").value = protocol;
    document.querySelector("#checksEdit1 .urlInput").value = url;
    document.querySelector("#checksEdit1 .methodInput").value = method;
    document.querySelector("#checksEdit1 .timeoutInput").value = timeoutSeconds;
    var successCodeCheckboxes = document.querySelectorAll("#checksEdit1 input.successCodesInput");
    for(var i = 0; i < successCodeCheckboxes.length; i++){
      if(successCodes.indexOf(parseInt(successCodeCheckboxes[i].value)) > -1){
        successCodeCheckboxes[i].checked = true;
      }
    }
  });
};

// Loop to renew token often
app.tokenRenewalLoop = function(){
  setInterval(function(){
    app.renewToken(function(err){
      if(!err){
        return;
      }
    });
  },1000 * 60);
};


app.init = () => {

  // Bind all form submissions
  app.bindForms();

  // Bind logout logout button
  app.bindLogoutButton();

  // Get the token from localstorage
  app.getSessionToken();

  // Renew token
  app.tokenRenewalLoop();

  // Load data on page
  app.loadDataOnPage();
}

//init the app after the window loads
window.onload = () => {
	app.init()
}