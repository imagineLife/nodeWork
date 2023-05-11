// a follow-up to "with-promises-promisify"

const { readFile, readdir } = require('fs').promises;

const STATE = {
  fileIteration: 0,
  filesData: [],
  filesToRead: []
}
const FILES_DIR = './files';

async function readAndUpdateState() {
  const FILE_TO_READ = `${FILES_DIR}/${STATE.filesToRead[STATE.fileIteration]}`
  console.log(`READING ${FILE_TO_READ} with readAndUpdateState`)
  readFile(FILE_TO_READ)
    .then((res) => {
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
    })
    .catch((e) => {
      throw new Error(e?.message);
    });
}

function readFilesAndStart( files) { 
  STATE.filesToRead = files;
  readAndUpdateState()
}
readdir(FILES_DIR).then(readFilesAndStart).catch(console.log);