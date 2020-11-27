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
