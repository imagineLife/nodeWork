1 -

- build a fn, `divideByTwo`
- if the param is not a number type, throw an Error Object with string `not a number`.
  - set this error to return a stack trace ()
- else return param / 2
  2 -
- write a definition of a `SyntaxError`
- write a definition of a `RangeError`
- write a definition of a `ReferenceError`
- write a definition of a `TypeError`
- write a definition of a `URIError`
  3 -
- create a fn `divideWhenEven`
- if not a number type, throw a type error with a string `must be a number`
- if less than or equal to zero, throw a range error with a string `must be greater than 0`
- if not even...
  - build a generic error
  - string 'amount must be even'
  - code = 'ERR_MUST_BE_EVEN'
  - throw it
- if even, return param / 2
  4 -
- create an new Error called `OutError`
  - extend the native Error
  - pass the new `OutError` a var called `v`
    - set the default `v` to an empty string
    - set the error to return `${v} must be even` when instantiated
    - assure that the name of the error returns when displayed in a terminal
