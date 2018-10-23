/*
	HANLDERS - 
	a lookup-table of request handlers
*/

//Dependencies



//hanlders
let routeHandlers = {}

//ping handler
routeHandlers.ping = (data, callback) => {
	callback(200)
}

routeHandlers.notFound = (data, callback) => {
	callback(404)
}

module.exports = routeHandlers;