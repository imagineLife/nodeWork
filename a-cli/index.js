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
const inquirer = require('inquirer');
const {
  clarifyEnums,
  loopThroughFieldsAndDefineTypes,
  createModuleString
} = require('./fns')
// const inquirer = require('..');
const model = {
  name: null,
  fields: [],
  firstFieldIdxWithoutType: 0,
  enumFields: null,
  firstEnumIdxWIthoutVals: 0
}

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

async function doTheWork() { 
  let initialAnswers = await inquirer.prompt(startingQuestions)
  model.name = initialAnswers.modelName;
  model.fields = initialAnswers.fields.replaceAll(' ', '').split(',')
  await loopThroughFieldsAndDefineTypes(model.firstFieldIdxWithoutType, model)
  await clarifyEnums(model)
  const textBlob = createModuleString(model)
  console.log('textBlob')
  console.log(textBlob)
  
}



doTheWork()