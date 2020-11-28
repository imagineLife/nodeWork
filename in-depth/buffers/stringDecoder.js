const { StringDecoder } = require('string_decoder')
const frag1 = Buffer.from('f09f', 'hex')
const frag2 = Buffer.from('9180', 'hex')
console.log(`1: `, frag1.toString()) // prints �
console.log(`2: `, frag2.toString()) // prints ��
const decoder = new StringDecoder()
console.log(`3: `, decoder.write(frag1)) // prints nothing
console.log(`4: `, decoder.write(frag2)) // prints