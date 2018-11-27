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

//list all the logs and OPTIONALLY include compressed logs
logsLib.listLogs = (includeCompressedLogs, callback) => {
	

	fs.readdir(logsLib.baseDir, (err, res) => {
		if(!err && res && res.length > 0){
			
			//collector of file names
			const trimmedFileNames = [];

			//
			res.forEach(fileName => {

				//collect existing log files
				if(fileName.indexOf('.log') > -1){
					trimmedFileNames.push(fileName.replace('.log',''));
				}

				//add on a gz filename to compressed file(s)
				if(fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs){
					trimmedFileNames.push(fileName.replace('.gz.b64',''));	
				}

			})

			callback(false, trimmedFileNames);

		}else{
			callback(err,data)
		}
	})
}



//export the module
module.exports = logsLib;
