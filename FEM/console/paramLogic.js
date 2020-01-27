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