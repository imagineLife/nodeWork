function streamWrite(buffer,encoding,next){
	this.push(buffer.toString().toUpperCase());
	next();
}

function streamEnd(done){
	done()
}

const through = require('through2');
const streamThroughHandler = through(streamWrite, streamEnd);

process.stdin.pipe(streamThroughHandler).pipe(process.stdout)