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
