const { execSync } = require('child_process');

console.log('before try')
try{
  execSync(`node -e "throw Error('child error')"`)
}catch(e){
  console.log('e')
  // console.log(e)
  console.log(e.stderr.toString())
  
}
console.log('after catch')