const fs = require('fs');

async function create(fileName,data,callback){

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
	try{
		const fileDescriptor = await fs.promises.open(fileName, 'wx');

		//take data, convert to string so that the str can be written to the file
		const stringData = JSON.stringify(data)

		// write the data to the file & close the file
		// takes fileDescriptor and data
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
	}catch(e){
		console.log('fs.open error')
		console.log(e)
		console.log('// - - - - - //')
	}
}

async function update(fileName, data){

	/*open the file
		passes the r+ flag for allowing writing
		will error out if the file doesn't exist
		WANNA KNOW MORE ABOUT FLAGS?
			https://nodejs.org/api/fs.html#fs_file_system_flags
	*/
	try{
		
		const { fd } = await fs.promises.open(fileName,'r+');
		
		// convert fileData to string
		const stringData = JSON.stringify(data)

		//truncate the file
		fs.ftruncate(fd, (err) => {
			if(err){
				console.log('Error truncating file')
			}

			//write to the file and close the file
			//writeSync might not be worth it
			fs.writeFile(fd, stringData, (err) => {
				if(err){
					console.log('Error Writing to existing file')
				}

				fs.close(fd, err => {
					if(err){
						console.log('Error CLOSING file')
					}
				})
			})
		})
	}catch(e){
		console.log('lib update error')
		console.log(e)
		console.log('// - - - - - //')
		return callback('Could not open the file for editing. This file may not exist.')
	}
}

module.exports.create = create;
module.exports.update = update;