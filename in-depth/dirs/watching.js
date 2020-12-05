const { watch } =require('fs');

const PATH_TO_WATCH = '.'
function watchHandler(e,fileName){
  console.log(`e: ${e}, file: ${fileName}`)
}

watch(PATH_TO_WATCH, watchHandler)

/*
  Triggering the watch handler
  - open a new terminal
    - node -e "fs.writeFileSync('test', 'test')"
      - create new file called 'test' with text 'test'
      - creates event "rename"
    - node -e "fs.mkdirSync('test-dir')"
      - creates folder test-dir
      - creates event "rename"
    - node -e "fs.chmodSync('test-dir', 0o644)"
      - sets permissions on dir
      - creates event ""rename
    

*/ 