#!/usr/bin/env node
"use strict"

const args = require("minimist")(process.argv.slice(2), {
	boolean: ["help"], //will return true
	string: ["file"]	//will return ''
})



/*
	JS LOGIC, how to handle the cmd input
*/

if(args.help){
	printHelp()
}else if (args.file){
	console.log(args.file);
}else{
	error('Incorrect usage.', true)
}



// **********
function error(errMsg, includeHelp = false){
	console.log(errMsg);
	if(includeHelp){
		console.log('');
		printHelp()
	}
}

// **********
function printHelp(){
	console.log('script usage');
	console.log('paramLogic.js --help');
	console.log('');
	console.log('--help      print this help');
	console.log('');
}


/*
	now
	running with no args:
console Jake$ ./paramLogic.js
Incorrect usage.

script usage
paramLogic.js --help

--help      print this help



running with --help
console Jake$ ./paramLogic.js --help
script usage
paramLogic.js --help

--help      print this help


console Jake$ ./paramLogic.js --file="stringHere"
stringHere




*/