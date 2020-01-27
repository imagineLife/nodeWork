/*
POSIX
	https://en.wikipedia.org/wiki/POSIX

- how c-style programs integrate with linux-style os
- 3 streams that model input & output to a program

fileDescriptors
- input
- output
- error

NODE exposes these interfaces...
- process
	- connections to hosting system
	- JS, though doesn't have IO in the spec
	.. perhaps why js is so easy to move to other environments


THE OUTPUT STREAM
- process.stdout is the STREAM to standard-output
to write content to a stream...
.write

- ... doesn't include trailing-new-line
console.log() does MORE than add a trailing \n

LEAST POSSIBLE efficiency is to print a string to a stream
*/


//TRY THESE BOTH
// console.log('hello world!')
process.stdout.write('hello world!')