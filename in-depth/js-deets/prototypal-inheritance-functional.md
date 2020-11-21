# Functional prototypal inheritance

```js
const human = {
  name: "Ralph", //a default name
  sayName: function () {
    console.log(`hi, my name is ${this.name}`);
  },
};

const teacher = Object.create(human, { name: { value: "Sally" } });

teacher.sayName(); //logs "hi, my name is sally"
```

- human is an object, containing...
  - `name` key, default to 'Ralph'
  - `sayName` key, returning a function that logs a string
    - this `sayName` leverages `this.name`, which references the CALLER

## Object.create syntax

- can take 2 args
  - 1st: the prototype object
    - above, the `human` is the prototype for teacher
  - 2nd: optional props object, the `Property Descriptor` object. This obj... - describes the characteristics of properties on an object (_another object being created, in this example_) - keys that will become keys on the resulting object - properties of each key
    **see fn-proto-inheritance.js for another example**
