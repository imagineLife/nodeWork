// The OS module

const { hostname, 
  homedir, 
  tmpdir, 
  platform,
  type
} = require('os');

console.log({
  hostname: hostname(), 
  homedir: homedir(), 
  tmpdir: tmpdir(),
  platform: platform(),
  type: type()
})

/*
  Output
  {
    hostname: 'Jakes-3.local',
    homedir: '/Users/Jake',
    tmpdir: '/var/folders/2-letters/random-string/Letter'
  }

  hostname 
    of the os
  platform
    returns same as process.platform
  type
    uses uname on non-windows
    uses ver   on windows
*/