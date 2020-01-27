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
	

*/

console.log('hello world!')