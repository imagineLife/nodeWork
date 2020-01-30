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
}

module.exports = api