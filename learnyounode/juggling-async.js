const http = require('http')
const passedURLs = [process.argv[2], process.argv[3], process.argv[4]];

let curUrlIdx = 0
let resArr = []

for(let i = 0; i < 3; i ++){
	http.get(passedURLs[i], res => {
		let resStr = ''
		res.setEncoding('utf8')
		res.on('data', data => {
			resStr += data;
		})
		res.on('end', () => {
			resArr.push(resStr)
			if(i == 2 && resArr.length === 3){
				for(let i = 0; i < 3; i++){
					console.log(resArr[i])
				}
			}
		})
	})
}
