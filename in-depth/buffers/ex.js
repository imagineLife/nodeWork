let bA, bB, bC, bD;

bA = Buffer.alloc(10)
// { bA: <Buffer 00 00 00 00 00 00 00 00 00 00> }
console.log({bA})

bB = bA.slice(2,3)
// { bB: <Buffer 00> }
console.log({bB})

// re-write an element
bB[0] = 100;
// { bB: <Buffer 64> }
console.log({bB})
//  {it: 100 }
console.log({it: bB[0]})