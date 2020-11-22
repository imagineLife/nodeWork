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

// helper
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
