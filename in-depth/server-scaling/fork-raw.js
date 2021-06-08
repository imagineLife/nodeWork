const http = require('http')
const port = process.env.PORT || 8080;
const chPro = require('child_process');

function rootHandler(req,res){
  const childProcess = chPro.fork('./fork-process.js');
  childProcess.send("message");
  childProcess.on("message", () => res.end('done'))
  return;
}

const server = http.createServer(rootHandler);

server.listen(port, () => {
  console.log(`plain-server is running on port ${port}`);
})