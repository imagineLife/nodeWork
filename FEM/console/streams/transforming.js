#!/usr/bin/env node
"use strict"


/*

	USE WITH...
	./fileHandling.js --file=./../files/lorem.txt

	step in the middle of a stream-pipe && work on the stream
*/

const path = require('path')
const fs = require('fs')
const getStdin = require('get-stdin')
const util = require('util')

//FOR TRANSFORMING STREAMS
const TramsformStream = require('stream').Transform

const args = require("minimist")(process.argv.slice(2), {
	boolean: ["help", "in"],
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
	outStream = incomingStream.pipe(upperStream)

	//output
	const targetStream = process.stdout;

	//piping the targetStream TO the outStream?!
	outStream.pipe(targetStream)
}