// a follow-up to "with-promises-manually"

const { readFile, readdir } = require('fs');

const STATE = {
  fileIteration: 0,
  filesData: [],
  filesToRead: []
}
const FILES_DIR = './files';

/*
  THIS is the focus of this file
  - a function
  - returns a promise
  - the promise contains callback-oriented syntax

  the code "flow" looks something like...
  - get files in the `files` dir
  - update some state
  - run async readAndUpdateState
    - which awaits the running of myFSPromise
    - if there are more files to read, re-run readAndUpdateState
*/ 
function myFSPromise(fileToRead) { 
  return new Promise((resolve) => {
    readFile(fileToRead, (e, fileContent) => {
      
      // increment state count
      STATE.fileIteration = STATE.fileIteration + 1;
      if (e) {
        console.error(e);
      } else {
        console.log(`DONE reading ${fileToRead}`)
        
        STATE.filesData.push(fileContent);

        // conditional continue
        const MORE_FILES_TO_READ = Boolean(STATE.fileIteration < STATE.filesToRead.length);
        resolve(MORE_FILES_TO_READ)
      }
    });
  })
}

async function readAndUpdateState() {
  const FILE_TO_READ = `${FILES_DIR}/${STATE.filesToRead[STATE.fileIteration]}`
  console.log(`READING ${FILE_TO_READ} with readAndUpdateState`)
  myFSPromise(FILE_TO_READ).then(res => {
    console.log('promise then result: ',res)
    
    if (res === true) readAndUpdateState();
    else { 
      console.log('DONE!');
      console.log(STATE.filesData.length);
    }
  });
}

function readFilesAndStart(err, files) { 
  if (err) {
    console.error(err);
    return;
  }
  STATE.filesToRead = files;
  readAndUpdateState()
}
readdir(FILES_DIR, readFilesAndStart)