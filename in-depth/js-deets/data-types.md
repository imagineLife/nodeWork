# Data Types
- null
  - typically describes the absence of an object
- undefined
  - typically describes the absence of a defined value
  - any var initialized without a value
  - any expression that tries to access a var that doesnt exist
  - a fn that doesn't return anything returns undefined
- number
  - double-precision floating-point
  - integers
  - decimals
- bigint
  - no upper/lower bounded number, sort-of!
- string
  - single-quote or double-quote
- boolean
- symbol

## Objects
- ...everything else is an object
- all objs have prototypes
  - a prototype is an implicit ref to another obj
  - WHEN an obj DOES NOT INCLUDE A PROPERTY, the objects PROTOTYPE is checked next
  - JS is a prototypal language

## Functions
- "...first class citizen"
- can return another fn
- can be passed _as an arg to another fn_
- can be assigned to an obj key
  - NOTE: `this` in this instance, refers to the object
  
  
## Objs, Fns, and THIS
```js
const o = { 
  id: 999, 
  fn: function () { console.log(this.id) } 
};
const anotherO = { 
  id: 2, 
  fn: obj.fn 
}
anotherO.fn() // prints 2, notice the THIS
o.fn() // prints 999, notice the THIS
```
