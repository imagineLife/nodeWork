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
function processFile(filepath){

	//when console.logging, will return a buffer
	// const fileContent = fs.readFileSync(filepath)

	//pass an encoding && now console.log will return
	//SLIGHTLY less performant than passing the buffer to process.stdout.write
	const fileContent = fs.readFileSync(filepath, 'utf8')
	console.log('fileContent')
	console.log(fileContent)

	//will automatically parse into a string
	// console.log('process.stdout.write(fileContent)')
	// process.stdout.write(fileContent)
	
}
/*

console.logging(fileContent) will return a buffer!
Jake$ ./usingFS.js --file=hello.txt
fileContent
<Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>

process.stdout.write(fileContent)
returns the parsed file content
Jake$ ./usingFS.js --file=hello.txt
Hello WorldJakes-3:fileArgs Jake$ 
*/