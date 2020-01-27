#!/usr/bin/env node
"use strict"

const args = require("minimist")(process.argv.slice(2), {
	boolean: ["help"], //will return true
	string: ["file"]	//will return ''
})
console.log('args')
console.log(args)

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


MANY conventions that args are input.




USING A PACKAGE THAT IS ALREADY INSTALLED
require("minimist")(process.argv.slice(2))

USING MINIMIST after cmd-line prompt
./accessingParams.js --hello=world something=else
 returns....
{ _: [ 'something=else' ], hello: 'world' }
[
  '/usr/local/Cellar/node/9.5.0/bin/node',
  '/Users/Jake/Desktop/projects/nodeWork/FEM/console/accessingParams.js',
  '--hello=world',
  'something=else'
]


Add a CONFIG to minimist
can force node to process params as specific types
*/

