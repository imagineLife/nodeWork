/*
  BLOCKING times
  2367949 (16 ms)
  43686389 (200 ms)
  93686687 (500 ms)
  936868033(4 seconds)
  29355126551 (very long time)

  on blocking
  - to see the 'blocking'
    - start an instance of the server using `node server.js`
    - navigate to http://localhost:3000/number?v=93686687
      - should take ~400ms
    - open another browser tab
    - navigate to http://localhost:3000/number?v=936868033
      - should take ~ 4s
    - start the one that takes 4s then immediated start the one that takes 400ms
      - HERE the 400ms one wont finish until the 4s one is done

  on non-blocking
  - to see the 'non-blocking'
  - start an instance of the server using `node server.js non`
    - navigate to http://localhost:3000/number?v=93686687
      - should take ~400ms
    - open another browser tab
    - navigate to http://localhost:3000/number?v=936868033
      - should take ~ 4s
    - start the one that takes 4s then immediated start the one that takes 400ms
      - HERE the 400ms one WILL finish until the 4s one is done
      - ALSO notice that the child-process ids that are logged are different
        - in the blocking approach, there is 1 process id for both processes



*/
//Dependency
const http = require('http');
const port = 3000;
const urlNode = require('url')
const isPrime = require('./is-prime');
const { fork } = require('child_process');
const server = http.createServer(({url, method, query, path}, res) => {
  console.log('Server req start')
  

	//get & parse the url
  //get the 'path' name from the url, trim the pathText
	const { pathname } = urlNode.parse(url, true);

	const trimmedPathTxt = pathname.replace(/^\/+|\/+$/g,'')
  
  // 'ignore' favicon request
  if(trimmedPathTxt == 'favicon.ico'){
    return res.end('favicon');
  }
  
  // 'ignore' routes NOT at '/number'
  if(!trimmedPathTxt.includes('number')){
    return res.writeHead(200).end('try a request at route "/number"');
  }
  
	//get http method that was used. its in the req object
	var reqMethod = method.toLowerCase()
  
  const queryString = urlNode.parse(url, true).query;
  
  if(!queryString || !queryString.v){
    return res.end('add a number')
  }

  let startTime = new Date();

  // handle blocking version
  if(process.argv[2] !== 'non'){
    return res.end(JSON.stringify(isPrime(parseInt(queryString.v), process.pid, startTime.getTime())));
  }
  
  // handle non-blocking version
  const childProcess = fork('./is-prime-process.js');
  childProcess.send({"number": parseInt(queryString.v), pid: childProcess.pid, startTime: startTime.getTime()})
  childProcess.on("message", message => res.end(JSON.stringify(message)))
  return;
})

//Start the server, listen on port 3000
server.listen(port, () => console.log(`Server is listening on port ${port}!!`))