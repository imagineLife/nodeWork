const { equal, deepEqual } = require('assert');

const a = {
  id: 1,
  name: {
    first: 'Sally',
    last: 'Sallyson'
  }
}

const b = {
  id: 1,
  name: {
    first: 'Sally',
    last: 'Sallyson'
  }
}

// FAILS
// equal(a,b);

// FAILS
// equal(a, {
//   id: 1,
//   name: {
//     first: 'Sally',
//     last: 'Sallyson'
//   }
// })

// Succeeds!
deepEqual(a, {
  id: 1,
  name: {
    first: 'Sally',
    last: 'Sallyson'
  }
})

