const { promisify } = require('util');

const print = (err, contents) => { 
  if (err) console.error(err)
  else console.log(contents )
}

const doOne = (cb) => {
  setTimeout(() => {
    cb(null, 'A')
  }, 500)
}

const doTwo = (cb) => {
  setTimeout(() => {
    cb(null, 'B')
  }, 250)
}

const doThree = (cb) => {
  setTimeout(() => {
    cb(null, 'C')
  }, 125)
}

function cb (_,letter){ console.log(letter)};

// Logs order C B A
// doOne(cb)
// doTwo(cb)
// doThree(cb)

/*
  Logs order A B C
*/ 

// 1, callback hell
// doOne((_,l) => {
//   console.log(l)
//   doTwo((_Two,lTwoL) => {
//     console.log(lTwoL);
//     doThree((_LThree, lTHree) => {
//       console.log(lTHree);
//     })
//   })
// })

function cbNicer (letter){ console.log(letter)};
// 2, nicer format
async function runNicer(){
  const oneRes = promisify(doOne)
  const twoRes = promisify(doTwo)
  const threeRes = promisify(doThree)
  await oneRes().then(cbNicer)
  await twoRes().then(cbNicer)
  await threeRes().then(cbNicer)
}
runNicer()