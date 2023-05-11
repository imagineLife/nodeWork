// a follow-up to "with-promises-chained"

const { readFile, readdir } = require('fs');
const { promisify } = require('util')

const STATE = {
  fileIteration: 0,
  filesData: [],
  filesToRead: []
}
const FILES_DIR = './files';

const fsPromise = promisify(readFile);

async function readAndUpdateState() {
  const FILE_TO_READ = `${FILES_DIR}/${STATE.filesToRead[STATE.fileIteration]}`
  console.log(`READING ${FILE_TO_READ} with readAndUpdateState`)
  fsPromise(FILE_TO_READ).then(res => {
    // increment state count
    STATE.fileIteration = STATE.fileIteration + 1;
    console.log(`DONE reading ${FILE_TO_READ}`);

    STATE.filesData.push(res);

    // conditional continue
    const MORE_FILES_TO_READ = Boolean(STATE.fileIteration < STATE.filesToRead.length);
    if (MORE_FILES_TO_READ) return readAndUpdateState();
    else {
      console.log('DONE!');
      console.log(STATE.filesData.length);
      return;
    }
  }).catch(e => {
    throw new Error(e?.message)
  })
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