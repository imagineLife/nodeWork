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

- **this** refers to the parent object that the function was called from, **not referred to the parent where the fn was assigned to**

```js
function logID() {
  console.log(this.id);
}

const oOne = {
  id: 999,
  // assigning the fn to oOne
  fn: logID,
};

const oTwo = {
  id: 2,
  // assigning a reference to the fn
  fn: oOne.fn,
};

oTwo.fn(); // prints 2
oOne.fn(); // prints 999
```

## Lambdas, fat-arrows

```js
const fatArrow = () => {
  console.log("this is a fat arrow fn");
};
```

- fat-arrows do NOT have the prototype property that "normal" fns have
