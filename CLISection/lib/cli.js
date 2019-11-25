/*
	DEPENDENCIES
*/
const readline = require('readline')
const util = require('util')
const debug = util.debuglog('CLI')
const events = require('events')

//init events class
class _events extends events{};

//init instance of events class
var e = new _events();

let cli = {}

cli.init = function(){
	console.log('\x1b[34m%s\x1b[0m', 'Welcome to the CLI!');
}

module.exports = cli;