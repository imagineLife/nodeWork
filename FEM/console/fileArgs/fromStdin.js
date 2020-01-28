#!/usr/bin/env node
"use strict"


/*
ADDING A FLAG to tell node to get the file from stdin
	USE BY 
		cat hello.txt | fromStdin.js --in
*/

const path = require('path')
const fs = require('fs')
const getStdin = require('get-stdin')
const util = require('util')

const args = require("minimist")(process.argv.slice(2), {
	boolean: ["help", "in"], // NEW 'IN' FLAG
	string: ["file"]
})



/*
	JS LOGIC, how to handle the cmd input
*/

if(args.help){
	printHelp()

	//handle stdin, from the args above
}else if (
	args.in ||
	args._.includes('-')
){

	// a promise-returning-mechanism
	// returning 
	getStdin().then(processFile).catch(error)

}else if(args.file){

	fs.readFile(filepath, function onContents(err,contents){
		if(err){
			error(err.toString())
		}else{
			processFile(contents.toString())
		}
	})	

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
	console.log('--help      						print this help');
	console.log('--file={FILENAME}      process this file');
	console.log('--in, -      					process stdin');
	console.log('');
}


// ********
function processFile(contents){
	contents = contents.toString().toUpperCase()
			process.stdout.write(contents)	
}