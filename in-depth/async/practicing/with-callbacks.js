const { readFile } = require('fs');
const FILES_DIR = './files'
const SM_FILE_PATH = `${FILES_DIR}/sm.txt`
const MD_FILE_PATH = `${FILES_DIR}/md.txt`
const LG_FILE_PATH = `${FILES_DIR}/lg.txt`
const printFileContents = (err, contents) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(contents.toString());
};
readFile(LG_FILE_PATH, printFileContents);
readFile(SM_FILE_PATH, printFileContents);
readFile(MD_FILE_PATH, printFileContents);
