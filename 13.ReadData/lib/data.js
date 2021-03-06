/*
Library for storing & editing data to the file-system
*/

//1.dependencies
const fs = require('fs')
const path = require('path')

//2.Container for this module to be exported
let lib = {}; 

//2.5 define the 'base directory'
//__dirname is the CURRENT file name
//takes these 2 locations, and makes this a clean path, 'baseDir' var
lib.baseDir = path.join(__dirname,'/../.data/')

//4.writing data to a file
/*
	take a directory (a sub-directory, like a table or collection of keys ie a user directory, a token directory etc.), 
	take a fileName that is being worked with
	takes the data that is going to the file
	takes a callback
*/
lib.create = (dir,fileName,data,callback) => {

	//5. TRIES TO OPEN the file for writing
	/*
		take a path to the file that is being created
		need to know where the data directory lives, relative to current work
			see baseDir above for location of 'base' directory

		passes the wx flag for allowing writing
		WANNA KNOW MORE ABOUT FLAGS?
			https://nodejs.org/api/fs.html#fs_file_system_flags
			I noticed the 'a' could be a useful flag, create if not present 
		
		a fileDescriptor is like a uniqueID of a file
	*/
	fs.open(`${lib.baseDir}${dir}/${fileName}.json`, 'wx', (err, fileDescriptor) => {
		if(!err && fileDescriptor){

			//take data, convert to string so that the str can be written to the file
			const stringData = JSON.stringify(data)

			//write the data to the file & close the file
			/*
				takes fileDescriptor and data
			*/
			fs.writeFile(fileDescriptor,stringData,(err) => {
				if(!err){
					fs.close(fileDescriptor, err => {
						if(!err){
							//a good thing!
							callback(false)
						}else{
							callback('error CLOSING new file')
						}
					})
				}else{
					callback('Error writing to new file')
				}
			})


		}else{
			callback('Couldn\'t create a new file, may already exist!')
		}
	})
}


//read data from a file
lib.read = (dir, fileName,callback) => {
	//read the contents
	//uses utf8 encoding
	//
	fs.readFile(`${lib.baseDir}${dir}/${fileName}.json`,'utf8',(err, data) => {
		callback(err,data)
	})
}


//3.export the module
module.exports = lib;