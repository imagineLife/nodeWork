//Dependency
const http = require('http');
const port = 3000;
const urlNode = require('url')

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

	//'log' the request path
	console.log(`request recieved on ${trimmedPathTxt || '/'} with method ${reqMethod}`)
  console.log(queryString.v)
  
  
  
  if(trimmedPathTxt !== 'favicon.ico'){
    if(queryString && queryString.v){
      // send the response
      return res.end(`number passed: ${queryString.v}`);
    }else{
      return res.end('add a number')
    }
  }else{
    res.end('favicon')
  }

})

//Start the server, listen on port 3000
server.listen(port, () => console.log(`Server is listening on port ${port}!!`))

// app.get("/isprime", (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin","*")
//     const jsonResponse = isPrime(parseInt(req.query.number))
//     res.send(jsonResponse)
// } )

// app.listen(8081, ()=>console.log("Listening on 8081") )

// function isPrime(number) {
//     let startTime = new Date();
//     let endTime = new Date();
//     let isPrime = true;
//     for (let i = 3; i < number; i ++)
//     {   
//         //it is not a prime break the loop,
//         // see how long it took
//         if (number % i === 0) 
//         {
//             endTime = new Date();
//             isPrime = false;
//             break;
//         }
//     }

//     if (isPrime) endTime = new Date();

//     return {
//         "number" : number,
//         "isPrime": isPrime,
//         "time": endTime.getTime() - startTime.getTime()
//         }

// }

/*
2367949 (16 ms)
43686389 (200 ms)
93686687 (500 ms)
936868033(4 seconds)
29355126551 (very long time)
*/