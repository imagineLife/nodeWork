const HEARTBEAT_INT = 400;
const STOP_INT = 1700;

const logBeat = () => {
  console.log('hb');
  process.exitCode = 1
}

const exitFn = () => {
  console.log('exit after this line')
  process.exit()
}

function exitCodeHandler(code){
  console.log(`EXITING CODE: ${code}`)
}
setInterval(logBeat, HEARTBEAT_INT)
setTimeout(exitFn, STOP_INT);
process.on('exit',exitCodeHandler);

/*
  This will output 
    hb
    hb
    hb
    hb
    exit after this line
    EXITING CODE: 1
*/ 