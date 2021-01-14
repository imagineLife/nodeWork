function d(){ return new Date() }

function logObj(action,file){
  return {
    date: new Date(),
    action,
    file
  }
}

function applyArgToCurDir(str){
  let argVal = str.substring(6);
    return `${__dirname}/${argVal}`
}

module.exports = {
  d,
  logObj,
  applyArgToCurDir
}