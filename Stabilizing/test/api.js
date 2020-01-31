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
	const reqDeeets = {
		'protocol':'',
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

module.exports = api