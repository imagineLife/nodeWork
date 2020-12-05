const { watch } =require('fs');

const PATH_TO_WATCH = '.'
function watchHandler(e,fileName){
  console.log(`e: ${e}, file: ${fileName}`)
}

watch(PATH_TO_WATCH, watchHandler)