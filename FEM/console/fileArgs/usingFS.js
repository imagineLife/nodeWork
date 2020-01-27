#!/usr/bin/env node
"use strict"


const path = require('path')
const fs = require('fs')

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
	processFile(path.resolve(args.file))
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


// ********
processFile(filepath){
	const fileContent = fs.readFileSync(filepath)
	console.log('fileContent')
	console.log(fileContent)
}
/*

*/