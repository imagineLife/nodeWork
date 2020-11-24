# Closure Scope

```js
function outerFn() {
  let a = true;

  function inner() {
    console.log("inner");
    console.log(a);
  }
  inner();
  a = false;
  inner();
}
outerFn();
```

## Scope Review

- the outer variable, `a`, is accessible from inner fns

```js
function outerFn() {
  let a = true;

  function inner(a) {
    console.log("inner");
    console.log(a);
  }
  inner(2); //logs 2
  a = false;
  inner(4); //logs 4
}
outerFn();
```

## When names collide

- here, the parameter a of inner is leveraged, rather than the parent-scope `a` variable

## Leveraging Encapsulation as private state

```js
// The Fn
function make(a) {
  let id = 0;
  return (n) => {
    id += 1;
    return { id, type: a, name: n };
  };
}

// USING the Fn
const createHuman = make("human");
const createEngine = make("engine");
```

- `init`
  - sets id in scope
  - takes arg a
  - returns a fn
- return from init
  - has access to the `a` param
  - has access to the included `id` variable
  - ...has access to the "parent closure scope"
