const inquirer = require('inquirer');
const clarifyEnums = require('./clarifyEnums');

function buildTypeValidationQuestion(field) { 
  const fieldTypes = ['STRING', 'INTEGER', 'BOOLEAN', 'ENUM']; 
  //'primaryKey','foreignKey'

  return {
    type: 'list',
    name: 'type',
    message: `TYPE: ${field}: What type is the ${field} field?`,
    choices: fieldTypes

  }
}

async function loopThroughFieldsAndDefineTypes(idx, model) { 
  
  // ask & collection feedback
  let fieldWithoutType = model.fields[idx]
  let thisTypeQuestion = buildTypeValidationQuestion(fieldWithoutType)
  let { type } = await inquirer.prompt(thisTypeQuestion)
  
  // update state
  model.fields[idx] = {name: fieldWithoutType, type};
  model.firstFieldIdxWithoutType++;
  
  // decide next steps
  // keep looping
  if (model.firstFieldIdxWithoutType <= model.fields.length - 1) {
    await loopThroughFieldsAndDefineTypes(model.firstFieldIdxWithoutType, model)
  }
  else { 
    // move on
    // clarifyEnums(model)
    console.log('MADE IT TO THE ELSE')
    
    return Promise.resolve(model);
  }
}

module.exports = loopThroughFieldsAndDefineTypes;