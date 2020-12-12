const { uptime, totalmem } = require('os')
setTimeout(() => {
  console.log(process.uptime()) // TODO output uptime of process
  console.log(uptime()) // TODO output uptime of OS
  console.log(totalmem()) // TODO output total system memory
  console.log(process.memoryUsage().heapTotal) // TODO output total process memory
  // NOPE process.memoryUsage().rss
}, 1000)