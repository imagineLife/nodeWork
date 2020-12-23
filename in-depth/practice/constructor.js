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

function inherit(protoProp){
  function ChainLink(){}
  ChainLink.prototype = protoProp;
  return new ChainLink()
}

Dog.prototype = inherit(Wolf.prototype)
Dog.prototype.bark = function () {
  console.log(`${this.name}: arf`)
}

// the prototype of Dolly is Dog
const Dolly = new Dog('Dolly')
Dolly.bark()
Dolly.yowl()