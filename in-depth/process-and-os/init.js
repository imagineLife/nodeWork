/*
  a terminal is availble through 3 methods on the process obj
  process.stdin
  process.stdout
  process.stderr
  - each is a stream
  - stdin is readable
  - stdout && stderr are writable
  - they never finish, never error, never close



  pipe-in-to-out.js
  run this
  node -p "crypto.randomBytes(100).toString('hex')" | node pipe-in-to-out.js

  - creates random character string
  - pipes input to output


  Can log exit codes
  - echo $? in mac

  process obj contains MORE info about the process..
  - cwd
    process.cwd()
      ALSO
      process.cwd() will change the directory...
  - platform being run on
    process.platform
  - process id
    process.pid
  - env vars applied to the process
    process.env

  Process METHODS
  - process.uptime()
    - seconds that the current process has been running
    - NOT the os
  - process.cpuUsage
    - returns an obj
    {user, system}
      - user: time that the node spent using the cpu
      - system: time KERNEL spent using CPU 
        due ot activity triggered by the process
  - process.memoryUsage
*/