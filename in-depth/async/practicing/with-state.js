const { readFile, readdir } = require('fs');
const STATE = {
  fileIteration: 0,
  filesData: [],
  filesToRead: []
}
const FILES_DIR = './files';

const printFileContents = (err, contents) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(contents.toString());
};

function readAndUpdateState() {
  const FILE_TO_READ = `${FILES_DIR}/${STATE.filesToRead[STATE.fileIteration]}`
  console.log(`READING ${FILE_TO_READ}`)
  
  readFile(FILE_TO_READ, (e, fileContent) => {
    // increment state count
    STATE.fileIteration = STATE.fileIteration + 1;
    if (e) {
      console.error(e);
    } else {
      STATE.filesData.push(fileContent);

      // conditional continue
      if (STATE.fileIteration < STATE.filesToRead.length) {
        readAndUpdateState()
      } else {
        console.log('DONE!')
        console.log(STATE.filesData.length)
      }
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