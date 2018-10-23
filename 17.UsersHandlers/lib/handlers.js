//HANLDERS - 
//a lookup-table
let routeHandlers = {}

//ping handler
routeHandlers.ping = (data, callback) => {
	callback(200)
}

routeHandlers.notFound = (data, callback) => {
	callback(404)
}