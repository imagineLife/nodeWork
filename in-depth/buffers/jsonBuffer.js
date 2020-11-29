const str = `dummy string here a`;
const bufferFromString = Buffer.from(str)
const jsonBuff = bufferFromString.toJSON()
/*
  {
  jsonBuff: {
    type: 'Buffer',
    data: [
      100, 117, 109, 109, 121,  32,
      115, 116, 114, 105, 110, 103,
       32, 104, 101, 114, 101,  32,
       97
    ]
  }
}
*/ 
console.log({jsonBuff})

const otherJsonBuff = JSON.stringify(bufferFromString)
/*
  {
  otherJsonBuff: '{"type":"Buffer","data":[100,117,109,109,121,32,115,116,114,105,110,103,32,104,101,114,101,32,97]}'
}
*/ 
console.log({otherJsonBuff})