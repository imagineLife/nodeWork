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

/*
  USING the make fn
  - these return the 'inner' fn of 'make' from above
  - following are 2 'instances' of the 'make' closure scope
  - 
*/
const createHuman = make("human");
const createEngine = make("engine");

/*
  Using the createX fns
  - notice the incrementing ids in the result
*/

const anne = createHuman("anne");
const bill = createHuman("bill");
const tom = createEngine("tom");
const sar = createEngine("sar");

console.log(anne); // returns {id:1, type: human, name: anne }
console.log(bill); // returns {id:2, type: human, name: bill }
console.log(tom); // returns {id:1, type: engine, name: tom }
console.log(sar); // returns {id:2, type: engine, name: sar }
```

- `init`
  - sets id in scope
  - takes arg a
  - returns a fn
- return from init
  - has access to the `a` param
  - has access to the included `id` variable
  - ...has access to the "parent closure scope"
- the `createHuman` and `createEngine` store 2 different 'instances' of the parent-scope
  - **notice the incrementing ids** on the 2 humans
  - **notice the incrementing ids** on the 2 engines

## Use Cases

- the 'outer scope' of the init fn could...
  - validate the param
  - _conditionally return different inner functions_ based on input param

## Advantages Over Object Composition

- eliminates 'complexity' of prototype management
- eliminates 'complexity' of context (_this_)
- eliminates the need for the `new` keyword

## Disadvantages Compared to Object Composition

- multiple inner fns get created with multiple instances, where object composition does NOT re-create inner fns

## This is recommended by linux foundation

- use fn composition, optimize the fn 'downsides' later
- JS engines use better && better optimization techniques internally
  - fast-enough for the use-case matters most
