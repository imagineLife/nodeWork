const fs = require('fs')

const fileToRead = process.argv[2]
fs.readFile(fileToRead, 'utf8', (err, data) => {
	if(err){
		return console.log(err)
	}
	const linesInFile = data.split('\n').length - 1
	console.log(linesInFile);
})