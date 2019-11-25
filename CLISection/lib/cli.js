/*
	DEPENDENCIES
*/
const readline = require('readline')
const util = require('util')
const debug = u.debuglog('CLI')
const events = require('events')

//init events class
class _events extends events{};

//init instance of events class
var e = new _events();

let cli = {}