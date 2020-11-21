# functions

Fns are "First Class citizens" in js.  
A Fn is an object.

## Fns returning fns

```js
function wrapper() {
  return function nested() {};
}
```

## Passing fns to another fn as an arg

```js
doSomething(function () {
  console.log(`This is a fn as a param`);
});
```
