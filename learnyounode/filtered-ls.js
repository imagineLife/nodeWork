const fs = require('fs')
const path = require('path');
const friendlyExt = `.${process.argv[3]}`;
const dirToRead = process.argv[2]
fs.readdir(dirToRead, (err, dirList) => {
	if(err){
		return console.log(err)
	}
	dirList.forEach(dir => {
		if(path.extname(dir) === friendlyExt){
			console.log(dir)
		}
	})
})