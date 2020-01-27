#!/usr/bin/env node
"use strict"

console.log(process.argv);
/*
 ./accessingParams.js from cmd
	THIS returns...
	[
	  '/usr/local/Cellar/node/9.5.0/bin/node',
	  '/Users/Jake/Desktop/projects/nodeWork/FEM/console/accessingParams.js'
	]

WITH a param in the terminal:
console Jake$ ./accessingParams.js --hello=world
[
  '/usr/local/Cellar/node/9.5.0/bin/node',
  '/Users/Jake/Desktop/projects/nodeWork/FEM/console/accessingParams.js',
  '--hello=world'
]
*/

