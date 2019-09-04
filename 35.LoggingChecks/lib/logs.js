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

		if(err || !fileDescriptor){
			return callback('Couldnt open file for appending')
		}

		//Append to file and close the file
		fs.appendFile(fileDescriptor,`${stringToAppend}\n`, err => {
			if(err){
				return callback('error appending and closing the file')
			}

			//close the file
			fs.close(fileDescriptor, (err) => {
				if(err){
					return callback('error closing file being appended')
				}
				callback(false)
			})
		})
	})
}

//list all the logs and OPTIONALLY include compressed logs
logsLib.listLogs = (includeCompressedLogs, callback) => {
	

	fs.readdir(logsLib.baseDir, (err, res) => {
		if(err || !res || !(res.length > 0)){
			return callback(err,data)
		}
			
		//collector of file names
		const trimmedFileNames = [];

		//loop through & deal with the log files
		res.forEach(fileName => {

			//collect existing log files
			//remove log fileExtension
			if(fileName.indexOf('.log') > -1){
				trimmedFileNames.push(fileName.replace('.log',''));
			}

			//add gz files to compressed file(s)
			//remove .gz fileExtensions
			if(fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs){
				trimmedFileNames.push(fileName.replace('.gz.b64',''));	
			}

		})

		callback(false, trimmedFileNames);
	})
}

//Compresses the contents of a single .log file
//into a .gz.b64 file within the same directory
logsLib.compress = (logID, newFileID, callback) => {

	const srcFile = `${logID}.log`;
	const destFile = `${newFileID}.gz.b64`;

	//read the src file
	fs.readFile(`${logsLib.baseDir}${srcFile}`,'utf8',(err, inputStr) => {

		if(err || !inputStr){
			return callback(error)
		}

		//compress the data using gzip
		zlib.gzip(inputStr, (err,resBuffer) => {
			
			if(err || !resBuffer){
				return callback(err)
			}

			//SEND compressed data to dest file
			fs.open(`${logsLib.baseDir}${destFile}`,'wx',(err, fileDesc) => {
				
				//WRITE to the destFile with base64 encoding
				if(err || !fileDesc){
					return callback(err)
				}

				fs.writeFile(fileDesc, resBuffer.toString('base64'), err => {
					if(err){
						return callback(err)
					}

					//close the destFile
					fs.close(fileDesc, (err) => {
						if(err){
							return callback(err)
						}
						return callback(false)
					})
				})
			})
		})
	})
}

//decompresses a .gz.b64 file into a str
logsLib.decompress =(fileID, callback) => {
	const fileNm = `${fileID}.gz.b64`;

	//read the file
	fs.readFile(`${logsLib.baseDir}${fileNm}`,'utf8',(err, resStr) => {

		if(err || !resStr){
			return callback(err)
		}

		//Decompress the file data
		const inputBuffer = Buffer.from(resStr,'base64');

		//
		zlib.unzip(inputBuffer, (err, outputBuffer) => {

			if(err || !outputBuffer){
				return callback(err)
			}
			let str = outputBuffer.toString();
			callback(false, str);
		})
	})
}

//Truncates a log file
logsLib.truncate = (logID, callback) => {
	fs.truncate(`${logsLib.baseDir}${logID}.log`,0,(err) => {
		if(err){
			return callback(err)
		}
		return callback(false)
	})
}

//export the module
module.exports = logsLib;
