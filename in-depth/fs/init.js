/*
2 focused modules
- fs
- path
  - for normalizing path manipulation between platforms
  - Windows systems use \ as path separators 
  - POSIX systems (Linux and macOS) use / 
    - ex, a path on Linux or macOS could be
      /file/subfile/example.js 
      whereas on Windows it would be 
      (assuming the path was on drive C), 
      C:/file/subfile/example.js 
    - backslash is the escape character in JS strings...ugh!
*/ 
const { parse, basename, dirname, extname, join } = require('path');



// LOCATE whatever the cur file is being executed from
// shows current file path
console.log({fileName: __filename})

// shows directory of current file
console.log({dirname: __dirname})

// create a new path to a new file
const NEW_FILE_NAME = 'new-file.txt'
const newFilePath = join(__dirname, NEW_FILE_NAME)
console.log({newFilePath})

// Levearging JOIN to make complex nested files && directories
const FACILITY = 'store';
const DEPT = 'shipping';
const ROOM = 'packaging';
const newDir = join(FACILITY,DEPT,ROOM);
console.log({newDir});

// leveraging more path methods
const PARSED = parse(__filename);
const BASED = basename(__filename);
const DIRD = dirname(__filename);
const EXTD = extname(__filename);

/*
  logs
  {
  PARSED: {
    root: '/',
    dir: '/Users/Jake/Desktop/projects/nodeWork/in-depth/fs',
    base: 'init.js',
    ext: '.js',
    name: 'init'
  }
}
*/
console.log({PARSED});

// { BASED: 'init.js' }
console.log({BASED});

// { DIRD: '/file/path/Desktop/projects/nodeWork/in-depth/fs' }
console.log({DIRD});

// { EXTD: '.js' }
console.log({EXTD});