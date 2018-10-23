/*
	HANLDERS - 
	a lookup-table of request handlers
*/

//Dependencies



//handlers
let routeHandlers = {}

//USERS handler
//FIGURES OUT wthe req method, & passes it to sub-handlers
routeHandlers.users = (data, callback) => {
	const acceptableMethods('post','get','put','delete');

	/*
		if the method from the Front-End matches an acceptable method,
		run it. use a NEW SET OF METHODS 'doUser'.
		ELSE return 405
	*/
	if(acceptableMethods.indexOf(data.method) > -1){
		routeHandlers.doUser[data.method](data,callback);
	}else{
		callback(405)
	}
}

//deals with users CRUD methods
routeHandlers.doUsers = {}

//Users POST
//REQ FIELDS: first, last, phone, pw, tosAgreement, NO optional Data
routeHandlers.doUsers.post = (data,callback){
	//GET all req'd fields from request payload
	const dataFN = data.payload.firstName
	const dataLN = data.payload.lastName
	const dataPhone = data.payload.phoneNumber
	const dataPW = data.payload.passWord
	const dataTos = data.payload.tosAgreement

	//check that all req'd fields exist
	const fn = typeof(dataFN) == 'string' && dataFN.trim().length > 0 ? dataFNdataFN.trim() : false;
	const ln = typeof(dataLN) == 'string' && dataLN.trim().length > 0 ? dataLN.trim() : false;
	const pn = typeof(dataPhone) == 'string' && dataPhone.trim().length == 10 ? dataPhone.trim() : false;
	const pw = typeof(dataPW) == 'string' && dataPW.trim().length > 0 ? dataPW.trim() : false;
	const tosAg = typeof(dataTos) == 'boolean' && dataTos == true ? true : false;
}

//Users PUT
routeHandlers.doUsers.put = (data,callback){
	
}

//Users GET
routeHandlers.doUsers.get = (data,callback){
	
}

//Users DELETE
routeHandlers.doUsers.delete = (data,callback){
	
}

//ping handler
routeHandlers.ping = (data, callback) => {
	callback(200)
}

routeHandlers.notFound = (data, callback) => {
	callback(404)
}

module.exports = routeHandlers;