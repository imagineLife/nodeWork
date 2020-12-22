const animal = {
  about: `A lovely animal`,
  sayItAll: function(){ console.log(`${this.name}, ${this.about} ${this.canDo}`)},
};

const dog = Object.create(animal, {
  canDo: { value: "that can bark" },
});

const cow = Object.create(animal, {
  canDo: { value: "that can moo"}
})

const ralph = Object.create(dog, {
  name: { value: `Ralph` },
});

ralph.sayItAll()
cow.sayItAll()