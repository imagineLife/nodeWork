# Promises

A Promise...

- is an object that represents an async operation
- returns a processed 'state':
  - settled
    - resolved
    - rejected
  - unsettled, still in-progress

## Vs Callbacks

```js
// callback
function asyncWrapper(callback) {
  doSomeAsyncThing((err, resDetails) => {
    callback(err, resDetails);
  });
}
// call the fn
asyncWrapper(handleAsyncResponse);

/*
  Same, with a promise
*/
function promiseWrapperFn() {
  return new Promise((res, rej) => {
    doSomeAsyncFn((err, resVal) => {
      // reject on error
      if (err) rej(err);
      else res(resVal);
    });
  });
}

const promiseResult = promiseWrapperFn();
// ...logic with promiseResult details next
```

## Leveraging Node Tool

Node includes a `promisify` utility, which can wrap an async fn in a promise...

```js
const { promisify } = require("util");
const promisifiedAsyncFn = promisify(doSomeAsyncFn);
function asyncFn() {
  return promisifiedAsyncFn();
}

const asyncResult = asyncFn();
// handle asyncResult next
```

## Leveraging then and catch

```js
const asyncResult = asyncFn();
asyncResult
  .then((promiseResult) => {
    // handle promise result here
  })
  .catch((promiseError) => {
    // handle when promise errors here
  });
```

## Promise dot all

`Promise.all`
Promise.all...

- is a fn
- takes an array
  - an array OF PROMISES
- returns...
  - a promise
  - a promise that resolves when ALL promises in the array have been ran and resolved
  - an array of values, 1 item per promise in the starting array
- run promises in parallel
- Rejects...
  - when one of the promises fails
  - AND other promises are IGNORED!

`Promise.allSettled`

- like `promise.all`, but has more 'tolerance' of each promise resolution/rejection
- is a fn
- return an arr objs, where each object...
  - has a `status` property, storing either `rejected` or `fulfilled`
  - rejected status have a `reason` property
  - fulfilled have a `value` prop

`Promise.any` is also another option
