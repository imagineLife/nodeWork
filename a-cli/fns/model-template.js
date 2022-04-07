function sqlTypeString(s) { 
  return `Sequelize.${s.toUpperCase()}`
}

function buildOptionalEnumString(obj) { 
  if (!obj.enumVals) return '';
  let arrStringRes = `[${obj.enumVals.split('|').map(itm => `'${itm}'`).join(',')}]`
  return `,
        values: ${arrStringRes}`
}
function typeObjectString(itm) { 
  let thisType = sqlTypeString(itm.type)
  let optionalEnumsArr = buildOptionalEnumString(itm)
  
  return `
      ${itm.name}: {
        type: ${thisType}${optionalEnumsArr}
      }`
}

function buildTypeObjString(arr) {
  let resString = '';
  arr.forEach((typeItm,idx) => {
    resString += typeObjectString(typeItm)
    if (idx !== arr.length - 1) { 
      resString +=`,`
    }
  })
  return resString;
}

function makeModelName(s) { 
  return s[0].toUpperCase() + s.substring(1)
}
function createModuleString(params) {
  const typesString = buildTypeObjString(params.fields)
  // console.log('typesString')
  // console.log(typesString)
  
  const modelName = makeModelName(params.name)
  return `const Sequelize = require('sequelize');
const db = require('../config/database');

const ${modelName} = db.define('${params.name}', {
 ${typesString}
});

module.exports = ${modelName};`
}

module.exports = createModuleString;