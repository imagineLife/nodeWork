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
```
