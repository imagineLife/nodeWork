//Dependency
const http = require('http');
const port = 3000;
const urlNode = require('url')
const isPrime = require('./is-prime');

const server = http.createServer(({url, method, query, path}, res) => {

	//get & parse the url
	const parsedUrl = urlNode.parse(url, true);
  const queryString = urlNode.parse(url, true).query;

	//get the 'path' name from the url, trim the pathText
	const pathText = parsedUrl.pathname;
	const trimmedPathTxt = pathText.replace(/^\/+|\/+$/g,'')
  if(!trimmedPathTxt.includes('number')){
    return res.writeHead(500).end('try a request at route "/number"');
  }
	//get http method that was used. its in the req object
	var reqMethod = method.toLowerCase()
  
  if(trimmedPathTxt !== 'favicon.ico'){
    if(queryString && queryString.v){
      // send the response
      // return res.end(`number passed: ${queryString.v} on pid ${process.pid}`);
      let startTime = new Date();
      return res.end(JSON.stringify(isPrime(parseInt(queryString.v), process.pid, startTime)));
    }else{
      return res.end('add a number')
    }
  }else{
    res.end('favicon')
  }

})

//Start the server, listen on port 3000
server.listen(port, () => console.log(`Server is listening on port ${port}!!`))

/*
2367949 (16 ms)
43686389 (200 ms)
93686687 (500 ms)
936868033(4 seconds)
29355126551 (very long time)
*/