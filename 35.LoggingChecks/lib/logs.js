/*
	A library for storing & rotating logs
*/

//Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib'); //compressing & decompressing

//logs library initialization
let logsLib = {};

//base dir of the logs folder
logsLib.baseDir = path.join(__dirname,'/../.logs/');

//APPEND a string to a file
//CREATE the file IF the file doesnt exist yet
logsLib.append = (fileName, stringToAppend, callback) => {

	//open the file for appending
	//a switch is opening for appending
	fs.open(`${logsLib.baseDir}${fileName}.log`,'a', (err, fileDescriptor) => {

		if(!err && fileDescriptor){

			//Append to file and close the file
			fs.appendFile(fileDescriptor,`${stringToAppend}\n`, err => {
				if(!err){

					//close the file
					fs.close(fileDescriptor, (err) => {
						if(!err){
							callback(false)
						}else{
							callback('error closing file being appended')
						}
					})

				}else{
					callback('error appending and closing the file')
				}
			})

		}else{
			callback('Couldnt open file for appending')
		}
	})
}




//export the module
module.exports = logsLib;
