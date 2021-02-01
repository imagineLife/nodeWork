const { execSync } = require('child_process');

const CHILD_STR = 'process.exit(1)'
const RUNNABLE_PROCESS = `node -e "${CHILD_STR}"`

try{
  const res = execSync(RUNNABLE_PROCESS)
  console.log(res.toString())
}catch(e){
  console.log('CATCH ERR')
  console.log(e)
}