// The OS module

const { hostname, homedir, tmpdir } = require('os');
console.log({
  hostname: hostname(), 
  homedir: homedir(), 
  tmpdir: tmpdir()
})

/*
  Output
  {
    hostname: 'Jakes-3.local',
    homedir: '/Users/Jake',
    tmpdir: '/var/folders/2-letters/random-string/Letter'
  }

  hostname of the os
*/