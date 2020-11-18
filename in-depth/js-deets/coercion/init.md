# Abstract Functions
- recursive fns
- take a HINT
- converts something to a primitive type


## ToPrimitive
- to convert something to a primitive type
- takes a type 'hint'
  - i.e a 'clue' on what type to convert to
- Examples
  - 2 methods available on a non-primitive
  - valueOf
  - toString
    - If a hint is number...
      - firs try valueOf()
      - if that doesnt return a value, try toString()
      - if that doesnt work error
    - if hint is string...
      - try toString()
      - if that didnt work, try valueOf()

## ToString
- takes a value
- gives representation in string form
- 