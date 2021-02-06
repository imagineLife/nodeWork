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
  - pass the new `OutError` a var called `v` - set the default `v` to an empty string - set the error to return `${v} must be even` when instantiated - assure that the name of the error returns when displayed in a terminal - throw the new `OutError` in the above step 3 instance when not even

5 -

- repeat above step 4
- gracefully catch the error
- on error, log an error with a string `Err caught, ${err}`

6 -

- repeat step 6 with a graceful catch of the error
- log a string based on the type of error that is thrown
- check for TypeError
- check for RangeError
- check for OutError
- if none of those, log an error with a string `Err caught, ${err}`
- run the fn a few times, throwing a few different errors

7 -

- build a function, takes a param `val`
  - return a promise
  - can leverage a `codify` fn to add a custom code to each err objects
  - if the param is not a number type, reject the promise with a TypeError and a string
  - if the param is less than or equal 0, return a RangeError
  - if the amount is not divisible by two, return the `OutError` as described above (maybe re-recreate the OutError in the same file)
  - else resolve the promise with the result of `val / 2`
  - MUST gracefully handle thrown errors
    - in a catch handler (try / catch or .then chaining + .catch)...
      - run if/else statements based on the error code
  - CALL THE FN - with bad vals - with proper val

8 - Handle Event propogation

- build an async `doIt` fn
  - call it using call.then.catch syntax
  - set it to handle known errors internally
  - set it to propogate unknown errors to a catch
  - set it to call `divideWhenEven` && save the result && log the result
  - set it to handle 'known erros'
    - Errs with code 1
      - throw a plain error with `wrong type`
    - Errs with code 2
      - throw a plain error with `out of range`
    - Errs with code 3
      - throw a plain error with `gotta be even`
  - set it to throw the erro when NOT one of the above err codes
    - catch this 'unknown' error in the catch block
