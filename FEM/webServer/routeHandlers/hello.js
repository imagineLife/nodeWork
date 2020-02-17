const helloHandler = (req,res) => {
	res.writeHead(200, {'Content-Type': "text/html"})
	return res.end('Simple Text')
}

module.exports = helloHandler;