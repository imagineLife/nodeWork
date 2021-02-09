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
      - passes a prop `thisName` to the parent class (_through the construcotr + super_) but adjusts `thisName` to be a string `${thisName}, and I'm a kid`
      - include a method called `shout` and log `${this.name}: ahh!`
- levearging closure scope
  - (_similar to currying_)
  - write an example where...
    - a fn `starter` ...
      - take a prop `type`
      - contains an inner counter var, set to 0
      - returns a fn, a fn that operates on a param `name`
        - increases inner counter var by 1
        - returns an obj
        - {
          - counter
          - type
          - name
        - }
  - call the fn 1x with type `human`, name results as `createHuman`
  - call the fn 1x with type `furniture`, name result `createFurniture`
    - call `createHuman` 2 different times, storing as `bob` and `jane`
    - call `createFurniture` 1x, storing as `chair`
    - LOGGING EACH OBJECT should return
      - incrementing IDs on humans, 1,2
      - single id on furniture, 1

## Streams

- Know 5 'major' Types of streams
  - know other node core APIs that are also streams
