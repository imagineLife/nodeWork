/*
 * CLI-related tasks
 *
 */

 // Dependencies
 /*
	READLINE
	https://nodejs.org/docs/latest-v9.x/api/readline.html
	The readline module provides an interface 
	for reading data from a Readable stream 
	(such as process.stdin) one line at a time. 
*/

const readline = require('readline');

/*
	OS
	https://nodejs.org/api/os.html#os_os_freemem
	The os module provides operating system-related
	 utility methods and properties.
*/
const os = require('os')

/*
	v8
	https://nodejs.org/api/v8.html
	The v8 module exposes APIs that are specific
	to the version of V8 built into the Node.js binary. 
*/
const v8 = require('v8');
const util = require('util');
const events = require('events');
class _events extends events{};
const e = new _events();
const dataLib = require('./data')
const logsLib = require('./logs')
const helpers = require('./helpers')