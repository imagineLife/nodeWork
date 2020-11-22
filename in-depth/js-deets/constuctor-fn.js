function Human(name) {
  this.name = name;
}

Human.prototype.sayName = function () {
  console.log(`HUMAN: ${this.name}`);
};

function Child(name) {
  Human.call(this, `${name} the CHILD`);
}

// helper
function inherit(proto) {
  console.log('inherit fn, proto')
  console.log(proto)
  function ChainLink() {}
  ChainLink.prototype = proto;
  return new ChainLink();
}

console.log('Human.prototype')
console.log(Human.prototype)

Child.prototype = inherit(Human.prototype);

Child.prototype.sayICanCount = function () {
  console.log(`HELLO! I'm ${this.name} and I can count!`);
};

const bill = new Child("Billy");
bill.sayName(); //prints HUMAN: Billy the CHILD
bill.sayICanCount(); //prints HELLO! I'm Billy the CHILD and I can count!
console.log('bill')
console.log(bill)
