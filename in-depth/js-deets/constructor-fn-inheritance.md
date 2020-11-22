# Constructor Functions and Prototypal Inheritance

- A common "legacy" approach
- All fns have a `prototype` property
- KEYWORED `NEW`: Define a property on a fn's prototype object, the ncall the fn with keyword `new`

```js
function Human(name) {
  this.name = name;
}

Human.prototype.sayName = function () {
  console.log(`Hi, I'm ${this.name}`);
};

function Child(name) {
  Human.call(this, `${name} is a child`);
}
```
