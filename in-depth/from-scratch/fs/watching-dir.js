/*
- watch a file system
  - wathcing a directory
  - maintaining state of the files in the dir
  - logging when...
    - a new file is added
    - a file is deleted
    - a file is updated
*/ 

const { watch, promises: { stat : promiseStat } } = require('fs');

function eventFromStats(
  {birthtimeMs, ctimeMs, mtimeMs, atimeMs},
  watchTime, optionalMemoryTime
  ){
    const stats = { 
      birthtimeMs, ctimeMs, mtimeMs, atimeMs
    }
    console.log('stats')
    console.log(stats)
    console.log('optionalMemoryTime')
    console.log(optionalMemoryTime)
    console.log('// - - - - - //')
    
  // CREATED
  if(birthtimeMs === ctimeMs) return 'created'
  else return 'other'
}

const DIR_STR_TO_WATCH = './watching'

// Storing global memory of file events && their event-time,
//   attempting to remove duplicate events
const fileEventMemory = {}

async function watchHandler(ev,file){
  console.log('---START WATCH---')
  let now = new Date()
  const FILE_PATH = `${DIR_STR_TO_WATCH}/${file}`
  try{
    const fileStats = await promiseStat(FILE_PATH)
  const eventType = eventFromStats(fileStats, now, fileEventMemory[FILE_PATH])
    console.log('eventType')
    console.log(eventType)
  }catch(e){
    console.log('e')
    console.log(e) 
  }
}
// WATCH!
watch(DIR_STR_TO_WATCH, watchHandler)