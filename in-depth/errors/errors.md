# Errors

## Operational Errors

- programmatic
- i.e
  - network failure
  - fs errors
  - ... i/o errors
- strategies can be built to 'handle' these errors...
  - retry a network error
  - trigger some side-effect for fs an error

## Developer Errors

- dev made a mistake
- program should NOT attempt to continue
- should crash + a description

## On Throwing and Crashing

```js
function divideByTwo(amount) {
  if (typeof amount !== "number")
    throw new Error("divideByTwo: amount must be a number");
  return amount / 2;
}
```

above...

- program will crash when a non-number is passed
- a 'stack trace' will print in console
  - the `new Error` creates the stack trace
- non-errors can be thrown, but are not recommended...

```js
function divideByTwo(amount) {
  if (typeof amount !== "number")
    throw "divideByTwo string: amount must be a number";
  return amount / 2;
}
```

## Native Errors

[Node Error API](https://nodejs.org/api/errors.html)

- AssertionError
  - failed assertion, typically by the `assert` module
- RangeError
  - an arg was not within the expected range
- ReferenceError
  - a variable that was attempted to be accessed is not defined
- SyntaxError
  - a program is not JavaScript
  - only thrown by code evaluation
  - are UNdiscoverable by the syntax that created the error... only found outside the context
- SystemError
  - thrown by node due to runtime errors
  - apps violate operationg system constraints
- TypeError

## Example of two errors

```js
function divideNumbersAtOrGreaterThanZero(amount) {
  if (typeof amount !== "number")
    throw new TypeError("amount must be a number");
  if (amount <= 0) throw new RangeError("amount must be greater than zero");
  return amount / 2;
}
```

## Customized Errors

There are many ways to express an error, heres two:

- a 'subclass' of a native error
- using a `code` property

### Extending the Native Error

```js
class MustBeEvenError extends Error {
  constructor(oddValue = "") {
    super(oddValue + " must be even");
  }
  get name() {
    return "MustBeEvenError";
  }
}
```
