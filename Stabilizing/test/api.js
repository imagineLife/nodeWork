/*
	API tests
*/

const app = require('./../index')
const assert = require('assert')
const http = require('http')
const config = require('./../lib/config')

let api = {}

let helpers = {}
helpers.getReq = function(passedPath,cb){

	//config the req details
	const reqDeets = {
		'protocol':'http:',
		'hostname': 'localhost',
		'port': config.httpPort,
		'method': 'GET',
		'path': passedPath,
		'headers': {
			'Content-Type': 'application/json'
		} 
	}

	//SEND the request
	const req = http.request(reqDeets, function(res){
		cb(res)
	})
	req.end()
}

//APP DOESNT THROW
api['app.init should start without throwing'] = function(done){
	assert.doesNotThrow(function(){
		app.init(function(optErr){
			done()
		})
	}, TypeError)
}

api['/ping should respond to GET with 200'] = function(done){
	helpers.getReq('/ping', function(res){
		assert.equal(res.statusCode,200)
		done()
	})
}

// api['/users should respond to GET with 400'] = function(done){
// 	helpers.getReq('/api/users', function(res){
// 		assert.equal(res.statusCode,400)
// 	})
// }

// api['/randomPath should respond to GET with 404'] = function(done){
// 	helpers.getReq('/randomPath', function(res){
// 		assert.equal(res.statusCode,404)
// 	})
// }

module.exports = api