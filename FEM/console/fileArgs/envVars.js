#!/usr/bin/env node
"use strict"


/*
	RUN BY...
	HELLO=WORLD ./envVars.js
	...or...
	BASE_PATH=./ ./envVars.js --file=hello.txt
*/

const path = require('path')
const fs = require('fs')
const getStdin = require('get-stdin')
const util = require('util')

const args = require("minimist")(process.argv.slice(2), {
	boolean: ["help", "in"], // NEW 'IN' FLAG
	string: ["file"]
})


// setup a 'baseBapth' in the var
const BASE_PATH = path.resolve(
	process.env.BASE_PATH || __dirname);


/*
	JS LOGIC, how to handle the cmd input
*/

if(process.env.HELLO){
	console.log(process.env.HELLO);
}

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

	fs.readFile(path.join(BASE_PATH, args.file), function onContents(err,contents){
		if(err){
			error(err.toString())
		}else{
			processFile(contents.toString())
		}
	})	

	// processFile(path.resolve(args.file))
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