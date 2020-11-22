# Constructor Functions and Prototypal Inheritance

- A common "legacy" approach
- All fns have a `prototype` property
- KEYWORED `NEW`: Define a property on a fn's prototype object, the ncall the fn with keyword `new`

```js
function Human(name) {
  this.name = name;
}

Human.prototype.sayName = function () {
  console.log(`HUMAN: ${this.name}`);
};

function Child(name) {
  Human.call(this, `${name} the CHILD`);
}

/*
  Utility fn, inherit
  an empty constructor fn
  create a new obj with a prototype pointing to the passed param
*/
function inherit(proto) {
  function ChainLink() {}
  ChainLink.prototype = proto;
  return new ChainLink();
}

Child.prototype = inherit(Human.prototype);

Child.prototype.sayICanCount = function () {
  console.log(`HELLO! I'm ${this.name} and I can count!`);
};

const bill = new Child("Billy");
bill.sayName(); //prints HUMAN: Billy the CHILD
bill.sayICanCount(); //prints HELLO! I'm Billy the CHILD and I can count!
```

## Notes

- `Human` and `Child` are both capitalized: PascaleCase
  - used to delineate functions that are intended to be consumed using the `new` keyword
- `sayName` fn 'method' was added to Human via the `prototype` object
  - every fn has a `prototype` object

## Prototype Chain Here

- the prototype of `bill` is `Child.prototype`
- the prototype of `Child.prototype` is `Human.prototype`
- the prototype of `Human.prototype` is `Object.prototype`

## Tracking Bill

- bill is an object
- bill is the `this` within the `Child` constructor fn
- the `Child` constructor fn passes the `this` to the `Human.call`
