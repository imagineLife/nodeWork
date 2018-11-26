/*
	A library for storing & rotating logs
*/

//Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib'); //compressing & decompressing

//logs library initialization
let logsLib = {};




//export the module
module.exports = logsLib;
