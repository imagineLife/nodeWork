// The OS module

const { hostname, 
  homedir, 
  tmpdir, 
  platform,
  type,
  uptime,
  freemem,
  totalmem
} = require('os');

console.log({
  hostname: hostname(), 
  homedir: homedir(), 
  tmpdir: tmpdir(),
  platform: platform(),
  type: type(),
  uptime: uptime(),
  freemem: freemem(),
  totalmem: totalmem()
})

function logSysStats(){
  console.log({
    uptime: uptime(),
    freemem: freemem(),
    totalmem: totalmem()
  })
}

/*
  Output of above
  {
    hostname: 'Jakes-3.local',
    homedir: '/Users/Jake',
    tmpdir: '/var/folders/2-letters/random-string/Letter',
    platform: 'darwin',
    type: 'Darwin'
  }

  hostname 
    of the os
  platform
    returns same as process.platform
  type
    uses uname on non-windows
    uses ver   on windows


    System STATS
    - uptime
    - free memory
    - total memory
*/


setInterval(logSysStats, 1000)
/** 
  Output of interval
  { uptime: 603410, freemem: 840437760, totalmem: 17179869184 }
  { uptime: 603411, freemem: 840163328, totalmem: 17179869184 }
  { uptime: 603412, freemem: 840929280, totalmem: 17179869184 }
  { uptime: 603413, freemem: 840273920, totalmem: 17179869184 }
  { uptime: 603414, freemem: 839954432, totalmem: 17179869184 }
  { uptime: 603415, freemem: 843300864, totalmem: 17179869184 }
  { uptime: 603416, freemem: 843079680, totalmem: 17179869184 }
  { uptime: 603417, freemem: 843321344, totalmem: 17179869184 }
*/ 