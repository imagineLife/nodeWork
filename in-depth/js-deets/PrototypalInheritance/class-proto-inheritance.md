# Class Syntax Prototypal Inheritance

`Class` _under the hood_ creates a function.  
`Class` creates a fn that should be called with keyword `new`.

## Example

```js
class Fish {
  constructor(name) {
    this.name = name;
  }
  bloop() {
    console.log(`${this.name} . . . bloop bloop!`);
  }
}

class Shark extends Fish {
  constructor(name) {
    super(`${name} the shark`);
  }
  growl() {
    console.log(`${this.name} : GROOOOWLLL`);
  }
}

const shabby = new Shark("Shabby");
shabby.growl();
shabby.bloop();
```

## Above

- the prototype of shabby is `Shark.prototype`
- the prototype of `Shark.prototype` is `Fish.prototype`
- the prototype of `Fish.prototype` is `Object.prototype`
- **extend** keyword makes prototypal inheritance less code intensive
  - extend ensures that the prototype of the new class will be the source class's prototype

### constructor

The constructor is similar to a fn body

```js
//these are the same
function Fish(n) {
  this.name = n;
}
class Fish {
  constructor(n) {
    this.name = n;
  }
}
```

### Super

- Super calls the parent class constructor
- super sets the `this` keyword to the current object/instance

```js
class Fish {
  constructor(n) {
    this.name = n;
  }
  bloop() {
    console.log(`${this.name}: blooop!`);
  }
}

// THAT gets converted to...
function Fish(n) {
  this.name = n;
}
Fish.prototype.bloop = function () {
  console.log(`${this.name}: blooop!`);
};
```
