const { execSync } = require('child_process');

console.log('before try')
try{
  execSync(`process.exit(0)`)
}catch(e){
  console.log('e')
  console.log(e)
}
console.log('after catch')