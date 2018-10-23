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
routeHandlers.doUsers.post = (data,callback){

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