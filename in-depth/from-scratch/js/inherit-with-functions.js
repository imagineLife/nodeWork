function inherit(protoProp){
  function NewObj(){}
  NewObj.prototype = protoProp;
  return new NewObj;
}

function LivingSpace(name){
  this.name = name;
}

LivingSpace.prototype.sayName = async function(){ 
  console.log('Starting say-name...')
  
  return new Promise((res) => {
    setTimeout(() => {
      console.log(`${this.name}`)
      console.log('done saying name')
    },1000)
  })
 }

function Ranch(name, orientation){
  LivingSpace.call(this, `${name} the Ranch`);
  this.orientation = orientation
  this.bedrooms = 3;
  this.livingspaces = 1;
  this.floors = 1;
  this.hallwayside = orientation === 'right-sided' ? 'left' : 'right'
}

function RaisedRanch(name, orientation){
  this.orientation = orientation
  Ranch.call(this, `${name} RAISED`);
  this.livingspaces = 2;
  this.floors = 2
}


Ranch.prototype = inherit(LivingSpace.prototype)
Ranch.prototype.writeBeds = function(){ console.log(`${this.name} has ${this.bedrooms} bedrooms`) }
Ranch.prototype.writeSpaces = function(){ console.log(`${this.name} has ${this.livingSpaces} living spaces`) }
Ranch.prototype.writeOrientation = function(){ console.log(`The hallway is on the ${this.hallwayside}`) }

RaisedRanch.prototype = inherit(Ranch.prototype);

const Ronnie = new Ranch('Ronnie', 'right-sided')

Ronnie.sayName()
Ronnie.writeBeds()
Ronnie.writeOrientation()

console.log('// - - - - - //')

const Ralph = new RaisedRanch('Ralph', 'left-sided')
Ralph.sayName()
Ralph.writeBeds()
Ralph.writeOrientation()