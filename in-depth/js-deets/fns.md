# functions

Fns are "First Class citizens" in js.  
A Fn is an object.

## Fns returning fns

```js
function wrapper() {
  return function nested() {};
}
```
