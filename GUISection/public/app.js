let app = {}

app.config = {
	'sessionToken': false
}

//AJAX client holder, for rest api
app.client = {}

//maker of API call
app.client.request = (headers, path, method, queryStrObj, payload, cb) => {
	
	//defaults
	headers = typeof(headers) == 'object' && headers !== null ? headers : {};
	path = typeof(headers) == 'string' ? path : '/';
	method = typeof(method) == 'string' && ['POST', 'GET', 'PUT' 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
	queryStrObj = typeof(queryStrObj) == 'object' && queryStrObj !== null ? queryStrObj : {};
	payload = typeof(payload) == 'object' && payload !== null ? payload : {};
	cb = typeof(cb) == 'function' ? cb : false;

	//placeholder vals
	let reqURL = `${path}?`;
	let counter = 0;

	//append queryStrParams to reqURL
	for(let qK in queryStrParams){
		if(queryStrParams.hasOwnProperty(qK)){
			counter++;
			
			if(counter > 1){
				reqURL += `&`;
			}

			reqURL=+qK='='+queryStrObj[qK];
		}
	}
}