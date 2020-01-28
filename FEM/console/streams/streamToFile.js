#!/usr/bin/env node
"use strict"


/*
	USE WITH...
	./streamToFile.js --file=./../files/lorem.txt
*/

const path = require('path')
const fs = require('fs')
const getStdin = require('get-stdin')
const util = require('util')

const TramsformStream = require('stream').Transform

const args = require("minimist")(process.argv.slice(2), {
	boolean: ["help", "in", "out"], //HERE we control the out flag
	string: ["file"]
})

// setup a 'baseBath'
const BASE_PATH = path.resolve(
	process.env.BASE_PATH || './../files');


//KNOW where to put the output
//files directory
const OUTFILE = path.join(BASE_PATH,'out.txt')

/*
	JS LOGIC, how to handle the cmd input
*/

if(process.env.HELLO){
	console.log(process.env.HELLO);
}

if(args.help){
	printHelp()

	//handle stdin, from the args above,
	// a filename from the cmd line
}else if (
	args.in ||
	args._.includes('-')
){

	// a promise-returning-mechanism, a STREAM!
	// returning 
	//PRE-stream
	// getStdin().then(processFile).catch(error)
	processFile(process.stdin)

}else if(args.file){
	let filePath = path.join(BASE_PATH,args.file)
	
	//create a readable stream from file
	let stream = fs.createReadStream(filePath)
	processFile(stream)

	//PRE stream...
	// fs.readFile(filePath), function onContents(err,contents){
	// 	if(err){
	// 		error(err.toString())
	// 	}else{
	// 		processFile(contents.toString())
	// 	}
	// })	
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
	console.log('--out      						print to the stdout');
	console.log('');
}


// ********
//takes a readable stream
//returns an output stream
function processFile(incomingStream){
	

	let outStream = incomingStream

	/*
		using transform
		https://nodejs.org/api/stream.html#stream_stream
		https://nodejs.org/api/stream.html#stream_class_stream_transform
	*/

	let upperStream = new TramsformStream({
		transform(chunk,enc,cb){
			this.push(chunk.toString().toUpperCase())
			cb();
		}	
	})

	//connect the input to the incoming && upper middleware...
	outStream = outStream.pipe(upperStream)

	//output
	let targetStream;

	/*
		DECIDE where the output goes to
	*/
	if(args.out){
		targetStream = process.stdout;
	}else{
		targetStream = fs.createWriteStream(OUTFILE)
	}

	//piping the targetStream TO the outStream?!
	outStream.pipe(targetStream)
}