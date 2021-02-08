## Node Topics

[CLI && Binary](#cli-&&-binary)  
[Debugging](#debugging)
[JS](#js)

### CLI && Binary

- run flags
  - `-e`: evaluate
  - `-p`: evaluate && print
  - `-r`: require, "pre-load" a module

## Debugging

- inspect && break on first line
  - `node --inspect-brk file-to-run.js`
  - open `chrone://inspect`
- break on an error
  - use the checkbox in chrome inspect view `pause on caught exceptions`
- add breakpoints to a node process
  - in the code
    - add a `debugger` keyword where the breakpoint will be leveraged
  - in the inspector
    - add a blue 'flag' to the line number that the breakpoint will be leveraged

## JS

- proptypal Inheritance
  - Functionally
    - using `Object.create` syntax
    - levearging the `Properties Descriptor Object`
    - express how js executes the calling of a method that is NOT directly set on the parent-most Object, rather a deeply nested protype
    - inspecting the prototype of an object using `getPrototypeOf`
  - Leveraging Constructor Fns
    - using the `prototype` property of a fn
    - building an `inherit` fn, that...
      - takes a `protoProp`
      - builds a `NewObj` fn
      - attaches the `protoProp` to the prototype of the `NewObj`
      - returns a new instance of the `NewObj`
      - ...using this `inherit` fn to make 1 Constructor fn inherit another Constructor's prototype
    - leveraging the util fn `inherits` to assign the prototype of 1 obj to another
  - Leveraging Class Syntax
    - building a class `person` that
      - takes a prop `name`
      - contains a method `sayName` that logs `my name is ${this.name}`
    - build another class, `kid`
      - inherits/extends the `person` class
      - passes a prop `thisName` to the parent class (_through the construcotr + super_) but includes a string `${thisName}, and I'm a kid`
