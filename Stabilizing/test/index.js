/*
	A Test Runner in node
*/


//dependencies
const helpers = require('../lib/helpers')
const assert = require('assert')

let _app = {}


/*
	each TEST will be part of an object
	each KEY in this obj represents test-types
*/
_app.tests = {
	'unit': {}
}

//ASSERT that the 'getANumber fn is returning a number
_app.tests.unit['helpers.getANumber should return a number type'] = function(done){
	let res = helpers.getANumber()
	let resType = typeof(res)
	assert.equal(resType, 'number');
	done()
}

//ASSERT that the 'getANumber fn is returning 1
_app.tests.unit['helpers.getANumber should return 1'] = function(done){
	let res = helpers.getANumber()
	assert.equal(res, 1);
	done()
}


