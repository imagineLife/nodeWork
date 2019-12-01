/*
	A library for storing & rotating logs, methods include:
	
	APPEND:
		appends a string to a file
		creates the file if not present

	LIST-LOGS:
		lists ALL the logs in the log directory
		optionally show compressed logs

	COMPRESS
		Compresses the contents of a single .log file
		into a .gz.b64 file within the same directory
		this happens daily

	DECOMPRESS
		decompresses a .gz.b64 file into a str

	TRUNCATE
		truncate a log file
	
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
logsLib.append = (optLogsFile, fileName, stringToAppend, callback) => {
	let dir = optLogsFile ? `${logsLib.baseDir}/${optLogsFile}` : `${logsLib.baseDir}`
	//open the file for appending
	//a switch is present for creating IF not present
	// https://nodejs.org/api/fs.html#fs_file_system_flags
	fs.open(`${dir}${fileName}.log`,'a', (err, fileDescriptor) => {

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
				return callback(false)
			})
		})
	})
}

//list all the logs and OPTIONALLY include compressed logs
logsLib.listLogs = (optLogFile, includeCompressedLogs, callback) => {
	let dir = optLogsFile ? `${logsLib.baseDir}/${optLogsFile}` : `${logsLib.baseDir}`

	fs.readdir(dir, (err, res) => {
		if(err || !res || !(res.length > 0)){
			return callback(err)
		}
			
		//collector of file names
		const trimmedFileNames = [];

		//loop through & deal with the log files
		res.forEach(fileName => {

			let isLogFile = fileName.indexOf('.log') > -1
			//collect existing log files
			//remove log fileExtension
			if(isLogFile){
				trimmedFileNames.push(fileName.replace('.log',''));
			}

			let isZippedFile = fileName.indexOf('.gz.b64') > -1
			//add gz files to compressed file(s)
			//remove .gz fileExtensions
			if(isZippedFile && includeCompressedLogs){
				trimmedFileNames.push(fileName.replace('.gz.b64',''));	
			}

		})

		callback(false, trimmedFileNames);
	})
}

//Compresses the contents of a single .log file
//into a .gz.b64 file within the same directory
logsLib.compress = (optLogsFile, logID, newFileID, callback) => {
	let dir = optLogsFile ? `${logsLib.baseDir}/${optLogsFile}` : `${logsLib.baseDir}`

	const srcFile = `${logID}.log`;
	const destFile = `${newFileID}.gz.b64`;

	//read the src file
	fs.readFile(`${dir}${srcFile}`,'utf8',(err, inputStr) => {

		if(err || !inputStr){
			return callback(err)
		}

		//compress the data using gzip
		zlib.gzip(inputStr, (errTwo,resBuffer) => {
			
			if(errTwo || !resBuffer){
				return callback(errTwo)
			}

			//SEND compressed data to dest file
			fs.open(`${logsLib.baseDir}${destFile}`,'wx',(errThree, fileDesc) => {
				
				//WRITE to the destFile with base64 encoding
				if(errThree || !fileDesc){
					return callback(errThree)
				}

				fs.writeFile(fileDesc, resBuffer.toString('base64'), errFour => {
					if(errFour){
						return callback(errFour)
					}

					//close the destFile
					fs.close(fileDesc, (errFive) => {
						if(errFive){
							return callback(errFive)
						}
						return callback(false)
					})
				})
			})
		})
	})
}

//decompresses a .gz.b64 file into a str
logsLib.decompress =(optLogsFile, fileID, callback) => {
	let dir = optLogsFile ? `${logsLib.baseDir}/${optLogsFile}` : `${logsLib.baseDir}`

	const fileNm = `${fileID}.gz.b64`;

	//read the file
	fs.readFile(`${dir}${fileNm}`,'utf8',(err, resStr) => {

		if(err || !resStr){
			return callback(err)
		}

		//Decompress the file data
		const inputBuffer = Buffer.from(resStr,'base64');

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
logsLib.truncate = (optLogsFile, logID, callback) => {
	let dir = optLogsFile ? `${logsLib.baseDir}/${optLogsFile}` : `${logsLib.baseDir}`

	fs.truncate(`${dir}${logID}.log`,0,(err) => {
		if(err){
			return callback(err)
		}
		return callback(false)
	})
}

//export the module
module.exports = logsLib;
