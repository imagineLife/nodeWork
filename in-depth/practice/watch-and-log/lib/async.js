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

function update(fileName, data){	
	// convert fileData to string
	const stringData = JSON.stringify(data)

	//truncate the file
	fs.appendFile(fileName, stringData, (err) => {
		if(err){
			throw new Error('appendFile: ',err)
			process.exit(1)
		}
	})
}

module.exports.create = create;
module.exports.update = update;