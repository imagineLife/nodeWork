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

			reqURL+=qK='='+queryStrObj[qK];
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
		reqObj.setRequestHeader('token', app.config.sessionToken.id)
	}

	//when the req comes back, handle response
	reqObj.onreadystatechange = () => {
		console.log('onreadystatechange');
		if(reqObj.readyState == XMLHttpRequest.DONE){
			let thisStatus = reqObj.status;
			let resTxt = reqObj.responseText;

			//cb if requested
			if(cb){
				try{
					console.log('CB HERE');
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
      });
    }
  }
};

// Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
  
  var functionToCall = false;
  
  // If account creation was successful, try to immediately log the user in
  if(formId == 'accountCreate'){
  	console.log('ACCOUNT-CREATE SENT!');
  }
};

app.init = () => {

	//Bind the form submissions
	app.bindForms()
}

//init the app after the window loads
window.onload = () => {
	app.init()
}