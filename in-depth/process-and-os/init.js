/*
  a terminal is availble through 3 methods on the process obj
  process.stdin
  process.stdout
  process.stderr
  - each is a stream
  - stdin is readable
  - stdout && stderr are writable


  pipe-in-to-out.js
  run this
  node -p "crypto.randomBytes(100).toString('hex')" | node pipe-in-to-out.js

  - creates random character string
  - pipes input to output

*/