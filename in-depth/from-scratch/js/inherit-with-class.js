class Person{
  constructor({name, age}){
    this.name = name
    this.age = age
    this.type = 'person'
    this.sayName = function(){ console.log(`my name is ${this.name}`)}
    this.sayAge = function(){ console.log(`I am ${this.age} years old`) }
    this.sayType = function(){ console.log(`I am a ${this.type}`) }
  }
}

class Kid extends Person{
  constructor(props){
    super(props)
    this.type = 'kid'
  }
}

const Joe = new Person({name: 'Joe', age: 28});
const Karl = new Kid({name: 'Karl', age: 12});


Joe.sayName();
Joe.sayType()
console.log('// - - - - - //')
Karl.sayName();
Karl.sayType()
