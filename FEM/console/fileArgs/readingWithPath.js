#!/usr/bin/env node
"use strict"

//CLONE fron paramLogic

const path = require('path')

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
	let filepath = path.resolve(args.file)
	console.log(args.file);
	console.log('filepath')
	console.log(filepath)
	
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
1.	using path
	Jake$ ./readingWithPath.js --file=hello
hello
filepath
/Users/Jake/Desktop/projects/nodeWork/FEM/console/fileArgs/hello

2.Jake$ ./readingWithPath.js --file=../hello
../hello
filepath
/Users/Jake/Desktop/projects/nodeWork/FEM/console/hello


*/