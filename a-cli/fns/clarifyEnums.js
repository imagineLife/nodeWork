const inquirer = require('inquirer');

function buildEnumClarificationQuestion(str) { 
  return {
    type: 'input',
    name: 'enumVals',
    message: `ENUM: ${str}: What are the enum values for this field? (use "|" separator)`
  }
}

async function clarifyEnums(model) { 
  for (let i = 0; i < model.fields.length; i++) { 
    let thisField = model.fields[i]
    if (thisField.type === 'ENUM') { 
      let thisFieldQuestion = buildEnumClarificationQuestion(thisField.name)
      let res = await inquirer.prompt(thisFieldQuestion)
      model.fields[i].enumVals = res.enumVals
    }
  }
}

module.exports = clarifyEnums;