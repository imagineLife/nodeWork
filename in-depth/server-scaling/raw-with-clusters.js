const { cpus } = require('os');
const { fork, isMaster } = require('cluster');

// Master process
if(isMaster){
  const safeCpuCount = cpus().length - 1;
  console.log(`Master Process: Forking ${safeCpuCount} CPUs`);
  for(let i = 0; i <= safeCpuCount; i++){
    fork();
  }
}else{
  console.log('Child Process: making a server!');
  
  const http = require('http')
  const port = process.env.PORT || 8080;

  function rootHandler(req,res){
    // mock a waiting process;
    for(var x = 0; x < 2e8; x++){}
    res.end('server response here!')
  }

  const server = http.createServer(rootHandler);

  server.listen(port, () => {
    console.log(`plain-server is running on port ${port}`);
  })
  
}