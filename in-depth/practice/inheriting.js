/*
  a "functional" approach
  - levearging object.create
  - takes 2 params
    - a 'base' object to inherit
    - an optional Properties Descriptor Object
*/ 
// 'Base' object
const animal = {
  type: `animal`,
  sayItAll: function(){ 
    if(!this.name && this.type){
      console.warn(`Please add a name to this ${this.type}`)
      return;
    }
    console.log(`${this.name}, an ${this.type} can ${this.canDo}`)
  },
};

// Inheritance at first level
const dog = Object.create(animal, {
  canDo: { value: "bark" },
});

// Inheritance at first level, 2nd example
const cow = Object.create(animal, {
  canDo: { value: "moo"}
})

// Inheritance at second level, ex1
const ralph = Object.create(dog, {
  name: { value: `Ralph` },
});

const sally = Object.create(dog, {
  name: { value: `Sally` },
});

ralph.sayItAll()
sally.sayItAll()

// console.log(Object.getOwnPropertyDescriptor(ralph, 'name'))
/* 
  Returns 
    {
      value: 'Ralph',
      writable: false,
      enumerable: false,
      configurable: false
    }
*/