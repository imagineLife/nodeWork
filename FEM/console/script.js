#!/usr/bin/env node

"use strict";

/*
	that top line tells the shell to INTERPRET this code
	this will execute similar to a bash script
	pronounced shibang
	/usr/bin/env is a helper that looks for the executable node

	make this an executable
	CHECK executable status using terminal
	ls -la
	the first column, -rwxr--r--
	if the 'x' is not there, cant execute it
	to make it executable
	chmod u+x script.js
	NOW i can run the file using ./script.js
	crazy
*/ 

printHelp()
// **********
function printHelp(){
	console.log('script usage');
	console.log('script.js --help');
	console.log('');
	console.log('--help      print this help');
	console.log('');
}