const { StringDecoder } = require('string_decoder')
const frag1 = Buffer.from('f09f', 'hex')
const frag2 = Buffer.from('9180', 'hex')
console.log(`1: `, frag1.toString()) // prints �
console.log(`2: `, frag2.toString()) // prints ��
const decoder = new StringDecoder()
console.log(`3: `, decoder.write(frag1)) // prints nothing
console.log(`4: `, decoder.write(frag2)) // prints


const decodeUTF = new StringDecoder('utf8');

const cent = Buffer.from(0xC2, 0xA2]);
console.log(`5: `,decodeUTF.write(cent));

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(`6: `,decodeUTF.write(euro));