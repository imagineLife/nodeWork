// 'Base' object
const animal = {
  type: `animal`,
  sayItAll: function(){ 
    if(!this.name && this.type){
      console.warn(`Please add a name to this ${this.type}`)
      return;
    }
    console.log(`${this.name}, an ${this.type}  can${this.canDo}`)
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

ralph.sayItAll()
cow.sayItAll()