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

## Fn as obj key value

```js
const o = {
  a: 1,
  fn: function () {
    console.log(this.a);
  },
};

o.fn(); //will print to stdout `1`
```

- **this** relates to the 'parent' object

```js
const oOne = {
  id: 999,
  fn: function () {
    console.log(this.id);
  },
};
const oTwo = {
  id: 2,
  fn: obj.fn,
};

oTwo.fn(); // prints 2
oOne.fn(); // prints 999
```
