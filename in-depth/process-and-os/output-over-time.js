const ONE_SEC = 1000000
const TIME_TILL_SECOND_RUN = 250
// the longer the MORE the third output will read
const TIME_TO_WAIT = 4000
function outputStats(){
  const uptime = process.uptime()
  const { user, system } = process.cpuUsage()
  console.log({uptime, user, system, seconds: (user + system)/ONE_SEC})
}

outputStats()

setTimeout(() => {
  outputStats()
  const now = Date.now()
  // make the CPU do some work:
  while (Date.now() - now < TIME_TO_WAIT) {}
  outputStats()
}, TIME_TILL_SECOND_RUN)