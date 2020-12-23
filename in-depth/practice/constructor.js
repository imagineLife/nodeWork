/*
  Using PascaleCase for fns that are
   intended to be called with `new` keyword
*/ 

// the prototype of Wolf is Object.prototype
function Wolf (name){
  this.name = name;
}

// All fns have a prototype property 
Wolf.prototype.yowl = function(){
  console.log(`${this.name} hooooowwwwwwl`)
}

// the prototype of Dog is wolf
function Dog(name){
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