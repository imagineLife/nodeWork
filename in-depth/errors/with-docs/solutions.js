// 1
function divideByTwo(n){
  if(typeof n !== 'number') throw new Error('not a number')
  return n / 2
}
// const res = divideByTwo('a') // THROWS
// const res = divideByTwo(18) // WORKS
console.log({res})

// 2. Error definitions

/*
- write a definition of a `SyntaxError`
  - an err trying to interpret invalid code, syntactically
- write a definition of a `RangeError`
  - when a value is not in a set range of allowed values
- write a definition of a `ReferenceError`
  - when a non-existent variable is referenced
- write a definition of a `TypeError`
  - when a val is not the expected type
- write a definition of a `URIError`
  - a global URI handling fn was used incorrectly
*/ 