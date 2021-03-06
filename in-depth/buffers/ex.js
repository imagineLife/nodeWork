let bA, bB, bC, bD;

bA = Buffer.alloc(10)
// { bA: <Buffer 00 00 00 00 00 00 00 00 00 00> }
console.log({bA})

bB = bA.slice(2,3)
// { bB: <Buffer 00> }
console.log({bB})

/*
  re-write an element
*/
bB[0] = 100;

// { bB: <Buffer 64> }
console.log({bB})

//  {it: 100 }
console.log({bBAtZero: bB[0]})

// Change in of initial buffer
// { bA: <Buffer 00 00 64 00 00 00 00 00 00 00> }
console.log({bA})


/*
  New Example, Uint8Array @ length of 10
*/
bC = new Uint8Array(10)
/*
  { bC: Uint8Array(10) [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
*/
console.log({bC})
bD = bC.slice(2,3);
// { bD: Uint8Array(1) [ 0 ] }
console.log({bD})

bD[0] = 100;

// { bD: Uint8Array(1) [ 100 ] }
console.log({bD})

/*
  { bC: Uint8Array(10) [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
*/
console.log({bC})

// Strings && Buffers
const strBuf = Buffer.from(`Demo String here`);
// { strBuf: <Buffer 44 65 6d 6f 20 53 74 72 69 6e 67 20 68 65 72 65> }
console.log({strBuf})
console.log({strBuf: strBuf + ''})

// Buffer vs string lengths
console.log('buffer vs string lengths')
console.log('👀'.length)
console.log(Buffer.from('👀').length)


