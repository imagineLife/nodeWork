/*
  gets config from config/<environment-here>.yaml
  stores results in global_state.js object
*/

/*
  dependencies
*/ 
const fs = require('fs');
const { loadAll } = require('js-yaml');
const { state } = require('./../global_state');

function loadConfig() {
  try {
    const ENV_FILE = process.env.NODE_ENV || 'development';
    let fileContents = fs.readFileSync(`./config/${ENV_FILE}.yaml`, 'utf8');
    state.config = loadAll(fileContents)[0];
  } catch (e) {
    console.log(e);
  }
}

module.exports = { loadConfig };
