/*

	Web-Worker related tasks

*/

//Dependencies
const path = require('path');
const fs = require('fs');
const dataLib = require('./data');
const https = require('https');
const http = require('http');
const helpersLib = require('./helpers');
const url = require('url');

let workersObj = {};

//lookup all checks, get their data, send to a validator
workersObj.gatherAllChecks = () => {

	//get a lits of all the checks
	dataLib.listFiles('checks', (err, files) => {
		
		if(!err && files && files.length > 0){
			
			files.forEach(file => {

				//Read in the check-file-data
				//Called originalCheckData because originalCheckData will be changed
				dataLib.read('checks', file, (err, originalCheckData) => {

					if(!err && originalCheckData){

						//pass the data to the check-Validator
						//check-validator continues or logs errors
						workersObj.validateCheckData(originalCheckData)

					}else{
						console.log('error reading one of the checks data...')
					}

				})
			})

		}else{
			//log because this is a BG worker, not a typical call & response
			console.log('couldnt find any checks!!')
		}
	})
}

//Sanity-checking the check data
// workersObj.validateCheckData = () => {
	
// }

//Timer, executing the worker-process once per minute
workersObj.startLoop = () => {
	setInterval(() => {
		workersObj.gatherAllChecks();
	},(1000 * 60)) //once-per-minute
}

//init script
workersObj.init = () => {
	
	//Execute all the CHECKS
	workersObj.gatherAllChecks();

	//Call a loop so that the checks continue on their own
	workersObj.startLoop();

}

//export the workersObj
module.exports = workersObj;