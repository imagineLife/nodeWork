const assert = require('assert')

/*
  an example of prototypes, 
    including tests asserting prototypal expectations
*/
// of leopard -> lynx -> cat
// leopard prototype must have ONLY a hiss method
// lynx prototype must have ONLY a purr method
// cat prototype must have ONLY a meow method
const cat = {
  meow: function(str){ console.log(`${str} the cat: meow`) }
}
const lynx = Object.create(cat, {
  purr: { value: function(str){ console.log(`${str}: prrr`)} }
})
const leopard = Object.create(l, {
  purr: { value: function(str){ console.log(`${str}: prrr`)} }
})

const felix = new cat()
felix.meow() // prints Felix the cat: meow
felix.purr() // prints Felix the cat: prrr
felix.hiss() // prints Felix the cat: hsss

// prototype checks, do not remove
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
