#!/usr/bin/env node
"use strict"


/*
	ZLIB
	https://nodejs.org/api/zlib.html#zlib_zlib

	USE WITH...
	./findStreamEnd.js --file=./../files/lorem.txt --out
	this 
*/

const path = require('path')
const fs = require('fs')
const getStdin = require('get-stdin')
const util = require('util')
const TramsformStream = require('stream').Transform

const zlib = require('zlib')

const availableCmdArgs = require("minimist")(process.argv.slice(2), {
	boolean: ["help", "in", "out", "compress" ,"decompress"], 
	string: ["file"]
})

/*
	taking advantage of the 'end' event in the stream
*/
function streamComplete(streamToCheck){
	return new Promise(function c(res){
		streamToCheck.on('end', res)
	})
}

// setup a 'baseBath'
const BASE_PATH = path.resolve(
	process.env.BASE_PATH || './../files');


//KNOW where to put the output
//files directory
let OUTFILE = path.join(BASE_PATH,'out.txt')

/*
	JS LOGIC, how to handle the cmd input
*/

if(process.env.HELLO){
	console.log(process.env.HELLO);
}

if(availableCmdArgs.help){
	printHelp()

	//handle stdin, from the availableCmdArgs above,
	// a filename from the cmd line
}else if (
	availableCmdArgs.in ||
	availableCmdArgs._.includes('-')
){

	processFile(process.stdin)

}else if(availableCmdArgs.file){
	let filePath = path.join(BASE_PATH,availableCmdArgs.file)
	
	//create a readable stream from file
	let stream = fs.createReadStream(filePath)
	processFile(stream)
	.then(function(){
		console.log('AFTER .then');		
	})
	.catch(error)

	console.log('COMPLETED else case, after processFile() ran');
	/*
		STREAMS ARE ASYNC, run 'outside' the main thread
		The above logs will return BEFORE node parses the txt file.
		try running...
		 ./findStreamEnd.js --file=./../files/hello.txt --out
		the COMPLETED text prints before the --out text returns

	*/
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
	console.log('--help               print this help');
	console.log('--file={FILENAME}    process this file');
	console.log('--in, -              process stdin');
	console.log('--out                print to the stdout');
	console.log('--compress           gzips the output');
	console.log('--decompress         decompreses (un-gzip) the input');
	console.log('');
}


// ********
//takes a readable stream
//returns an output stream
async function processFile(incomingStream){

	let outStream = incomingStream


	if(availableCmdArgs.decompress){
		let unzippedStream = zlib.createGunzip()
		outStream = outStream.pipe(unzippedStream)
	}
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

	//OPTIONAL COMPRESS
	if(availableCmdArgs.compress){

		/*
			makes a transform stream
			understands the gzip protocol
			the compression protocol was designed for streaming
		*/
		let gZipStream = zlib.createGzip()
		outStream = outStream.pipe(gZipStream)

		//re-name the output file extension 
		// from txt to .gz
		OUTFILE = `${OUTFILE}.gz`
	}

	//output
	let targetStream;

	/*
		DECIDE where the output goes to
	*/
	if(availableCmdArgs.out){
		targetStream = process.stdout;
	}else{
		targetStream = fs.createWriteStream(OUTFILE)
	}

	//piping the targetStream TO the outStream
	outStream.pipe(targetStream)

	await streamComplete(outStream)
}