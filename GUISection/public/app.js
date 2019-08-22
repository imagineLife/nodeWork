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
	path = typeof(path) == 'string' ? path : '/';
	method = typeof(method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
	queryStrObj = typeof(queryStrObj) == 'object' && queryStrObj !== null ? queryStrObj : {};
	payload = typeof(payload) == 'object' && payload !== null ? payload : {};
	cb = typeof(cb) == 'function' ? cb : false;

	//placeholder vals
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

	console.log('reqURL')
	console.log(reqURL)
	

	//build the request
	let reqObj = new XMLHttpRequest();
	reqObj.open(method, reqURL, true);
	reqObj.setRequestHeader('Content-Type', 'application/json');

	//add each header  ot the request
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