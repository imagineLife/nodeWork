const assert = require('assert')
// TODO:
// implement a way to create a prototype chain
// of leopard -> lynx -> cat
// leopard prototype must have ONLY a hiss method
// lynx prototype must have ONLY a purr method
// cat prototype must have ONLY a meow method

const leopard = {
  hiss: x => `${x}: hss`
}

const lynx = Object.create(leopard, {
  purr: { value: x => `${x}: prrr` }
})

const cat = Object.create(lynx, {
  meow: { value: x => `${x}: meow` }
})

// const felix = null //TODO replace null with instantiation of a cat
const felix = Object.create(cat, {
  name: {value: 'Felix the cat'}
})

felix.meow() // prints Felix the cat: meow
felix.purr() // prints Felix the cat: prrr
felix.hiss() // prints Felix the cat: hsss

// VALIDATE ASSUMPTIONS HERE!
const felixProto = Object.getPrototypeOf(felix)
const felixProtoProto = Object.getPrototypeOf(felixProto)
const felixProtoProtoProto = Object.getPrototypeOf(felixProtoProto)
assert(Object.getOwnPropertyNames(felixProto).length, 1)
assert(Object.getOwnPropertyNames(felixProtoProto).length, 1)
assert(Object.getOwnPropertyNames(felixProtoProto).length, 1)
assert(typeof felixProto.meow, 'function')
assert(typeof felixProtoProto.purr, 'function')
assert(typeof felixProtoProtoProto.hiss, 'function')
console.log('prototype checks passed!')