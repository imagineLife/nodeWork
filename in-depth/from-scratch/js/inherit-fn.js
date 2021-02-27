const livingSpace = {
  doors: 1,
  beds: 1,
  rooms: 1,
  walls: 4,
  bathrooms: 1
}

const House = Object.create(livingSpace, {
  doors: { value: 2 },
  carpets: { value:  1 },
  rooms: { value:  5 },
  bathrooms: { value:  1.5 }
})
console.log(House[process.argv[2]])
