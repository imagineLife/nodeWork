const isPrime = require('./is-prime');
process.on("message", ({number, pid, startTime}) => {
  console.log('child-process message!')
  
  console.log('child-process pid')
  console.log(pid)
  
  const jsRes = isPrime(number, pid, startTime);
  process.send({...jsRes, pid: process.pid});
  process.exit()
})