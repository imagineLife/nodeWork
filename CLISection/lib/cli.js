/*
	DEPENDENCIES
*/

/*
	READLINE
	https://nodejs.org/docs/latest-v9.x/api/readline.html
	The readline module provides an interface 
	for reading data from a Readable stream 
	(such as process.stdin) one line at a time. 
*/
const readline = require('readline')
const util = require('util')
const debug = util.debuglog('CLI')
const events = require('events')
const helpers = require('./helpers')

//init events class
class _events extends events{};

//init instance of events class
var e = new _events();

let cli = {}

// process the input
cli.processInput = str => {

	let isString = helpers.isString(str)
	if(isString){
		let inputs = [
			'man',
			'help',
			'exit',
			'stats',
			'list users',
			'more user info',
			'list checks',
			'more check info',
			'list logs',
			'more log info'
		]
	}
}

cli.init = function(){
	console.log('\x1b[34m%s\x1b[0m', 'Welcome to the CLI!');

	//start the cli interface
	/*
		Instances of the readline.Interface class are constructed
		 using the readline.createInterface() method. Every instance
		 is associated with a single input Readable stream and
		 a single output Writable stream. The output stream is used 
		 to print prompts for user input that arrives on, 
		 and is read from, the input stream.
	*/
	let cliInterface = readline.createInterface({
		input: process.stdin,
		output: process.stout,
		prompt: ''
	})

	/*
		The rl.prompt() method writes the readline.Interface 
		instances configured prompt to a new line in output in order to 
		provide a user with a new location at which to provide input.
			When called, rl.prompt() will resume the input stream if 
		it has been paused.
			If the readline.Interface was created with output set 
			to null or undefined the prompt is not written.
	*/
	cliInterface.prompt()

	cliInterface.on('close', function(){
		process.exit(0)
	})

}

module.exports = cli;