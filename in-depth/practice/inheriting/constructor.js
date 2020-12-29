/*
  Constructor Functions
  here, Wolf && Dog are constructor function
 */ 

/*
  Using PascaleCase for fns that are
   intended to be called with `new` keyword
*/ 

// the prototype of Wolf is Object.prototype
// logging `this` returns Wolf {}
function Wolf (name){
  this.name = name;
}

// All fns have a prototype property 
Wolf.prototype.yowl = function(){
  console.log(`${this.name} hooooowwwwwwl`)
}

// the prototype of Dog is wolf
// logging `this` returns Wolf {}
function Dog(name){

  /* 
    - `this` gets passed to wolf.call
    - `this` is referenced inside the wolf constructor
      && assigns this.name from the name
    - the 2nd `param` of the call fn is the fn param
      - the "name" arg passed to Wolf is Dolly the dog,
        && Dolly the dog gets assigned to this.name
  */
  Wolf.call(this, `${name} the dog`)
}

/*
  inherit
  - uses empty constructor fn
  - creates a new obj with prototype
    POINTING to the passed param obj prototype
*/ 
function inherit(protoProp){
  function ChainLink(){}
  ChainLink.prototype = protoProp;
  return new ChainLink()
}

// Dog inherits wolf
Dog.prototype = inherit(Wolf.prototype)

// add bark to dog
Dog.prototype.bark = function () {
  console.log(`${this.name}: arf`)
}

const Waldo = new Wolf('Waldo')
Waldo.yowl() // Waldo hoooowl

// the prototype of Dolly is Dog
const Dolly = new Dog('Dolly')
Dolly.bark()
Dolly.yowl()


/*
  can also use native node module for inheritance
  
  const { inherits } = require('utils')
  function Animal(name){
    this.name = name
  }

  function Mammal(){
    this.type = 'mammal'
    this.sayType = `${this.name} is a mammal`
  }

  Bear.prototype.move = function(){
    console.log(`${this.name} crawling`)
  }

  inherits()
*/ 