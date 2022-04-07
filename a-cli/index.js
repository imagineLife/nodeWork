/*
  create-a-model from a cli
  - ask for field names (doTheWork)
  - ask for field types (doTheWork)

  - ask if any will be foreign keys (clarifyForeignKeys)
  - if enum fields, clarify enum options (clarifyEnumOptions)
  
  - MOCKS:
    - currently mock other table names table names.... hmm...
*/

'use strict';
const inquirer = require('..');
const model = {
  name: null,
  fields: [],
  firstFieldIdxWithoutType: 0,
  enumFields: null,
  firstEnumIdxWIthoutVals: 0
}

const fieldTypes = ['string', 'int', 'bool', 'enum', 'primaryKey','foreignKey'];

const whatsTheResource = {
  type: 'input',
  name: 'modelName',
  message: 'what is the name of the resource'
}

const listTheFields = {
  type: 'input',
  name: 'fields',
  message: 'what are the fields in this model'
}

const startingQuestions = [
  whatsTheResource,
  listTheFields
]

function likesFood(aFood) {
  return function (answers) {
    return answers[aFood];
  };
}

async function doTheWork() { 
  let initialAnswers = await inquirer.prompt(startingQuestions)
  model.fields = initialAnswers.fields.replaceAll(' ', '').split(',')
  loopThroughFieldsAndDefineTypes(model.firstFieldIdxWithoutType)
}

function buildTypeValidationQuestion(field) { 
  return {
    type: 'list',
    name: 'type',
    message: `TYPE: ${field}: What type is the ${field} field?`,
    choices: fieldTypes

  }
}

function buildEnumClarificationQuestion(str) { 
  return {
    type: 'input',
    name: 'enumVals',
    message: `ENUM: ${str}: What are the enum values for this field? (use "|" separator)`
  }
}

async function loopThroughFieldsAndDefineTypes(idx) { 
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
    loopThroughFieldsAndDefineTypes(model.firstFieldIdxWithoutType)
  }
  else { 
    // move on
    clarifyEnums()
  }
}

async function clarifyEnums() { 
  for (let i = 0; i < model.fields.length; i++) { 
    let thisField = model.fields[i]
    if (thisField.type === 'enum') { 
      let thisFieldQuestion = buildEnumClarificationQuestion(thisField.name)
      let res = await inquirer.prompt(thisFieldQuestion)
      model.fields[i].enumVals = res.enumVals
    }
  }
  console.log('model.fields')
  console.log(model.fields)
  
}

doTheWork()