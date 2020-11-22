function Human(name) {
  this.name = name;
}

Human.prototype.sayName = function () {
  console.log(`Hi, I'm  HUMAN: ${this.name}`);
};

function Child(name) {
  Human.call(this, `${name}: im a CHILD`);
}

// helper
function inherit(proto) {
  function ChainLink() {}
  ChainLink.prototype = proto;
  return new ChainLink();
}

Child.prototype = inherit(Human.prototype);

Child.prototype.sayICanCount = function () {
  console.log(`HELLO! I'm ${this.name} and I can count!`);
};

const bill = new Child("Billy");
bill.sayName();
bill.sayICanCount();