/*
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
*/

function starter(type){
  console.log('args')
  console.log(arguments)
  let counter = 0;
  return function(name){
    console.log({'nested fn name':name})
    
    counter++;
    return {
      counter,
      type,
      name
    }
  }
}

const createHuman = starter('Juman')
const createBox = starter('Bawx')

const A = createHuman('A')
const B = createHuman('B')
const C = createHuman('C')
const ATwo = createBox('AB')
const AThree = createBox('AC')
console.log({A})
console.log({B})
console.log({C})
console.log({ATwo})
console.log({AThree})

