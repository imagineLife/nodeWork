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
