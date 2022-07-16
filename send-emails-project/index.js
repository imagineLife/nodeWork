const { loadConfig } = require('./eventHandlers')
const { state } = require('./global_state')
try {
  loadConfig()
  console.log('state')
  console.log(state)
  
} catch (error) {
  console.log('GLOBAL ERROR')
  console.log(error.message)
  
}