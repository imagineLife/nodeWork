const livingSpace = {
  doors: 1,
  beds: 1,
  rooms: 1,
  walls: 4,
  bathrooms: 1,
  countRooms: function(){ return this.rooms + this.bathrooms}
  // countWindows: function(){ return this.countRooms() * this.windowsPerRoom }
}

const House = Object.create(livingSpace, {
  doors: { value: 2 },
  carpets: { value:  1 },
  rooms: { value:  5 },
  bathrooms: { value:  1.5 },
  windowsPerRoom: { value: 2 }
})

/*

*/
House.countWindows = function(){ return this.countRooms() * this.windowsPerRoom };

let cliVar = process.argv[2]
console.log(cliVar)
console.log(typeof House[cliVar] !== 'function' ? House[cliVar] : House[cliVar]())
