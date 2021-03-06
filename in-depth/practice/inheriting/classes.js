/*
  Inheritance with class syntax
*/ 

class Vehicle {
  constructor(name){
    this.name = name
  }
  honk(){ console.log(`${this.name}: HONK HONK`) }
}

/*
  the above `Vehicle` class gets de-composed, un-'sugar'ed to..
  function Wolf (name){
    this.name = name
  }

  Wolf.prototype.howl = function(){
    console.log(`${this.name}: HONK HONK`)
  }
*/ 

class SportsCar extends Vehicle{
  constructor(name){
    super(`${name} the SportsCar`)
  }
  vroom(){ console.log(`${this.name}: vroom vroom`)}
}

const zippy = new SportsCar('Zippy')
zippy.honk()
zippy.vroom()

console.log(Object.getPrototypeOf(zippy) === SportsCar.prototype) //true
console.log(Object.getPrototypeOf(SportsCar.prototype) === Vehicle.prototype) //true
