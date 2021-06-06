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
  
  const e = require('express');
  const app = e();
  const port = process.env.PORT || 8080;
  // const { spawn } = require('child_process');
  const pid = process.pid;

  const server = app.listen(port, () => {
    console.log(`express-server is running on port ${port} with pid ${pid}`);
  })

  function rootHandler(req,res){
    // mock a waiting process;
    for(var x = 0; x < 2e8; x++){}
    res.send('server response here!')
  }
  app.get('/', rootHandler)
  
}