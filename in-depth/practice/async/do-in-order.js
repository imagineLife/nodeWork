/*
  3 Fns that are awaiting a response
  Goal to have output read C then B then A
*/ 

// for 2nd+ approach
const { promisify } = require('util');

const fnA = (cb) => {
  setTimeout(() => {
    cb(null, 'A')
  }, 500)
}

const fnB = (cb) => {
  setTimeout(() => {
    cb(null, 'B')
  }, 250)
}

const fnC = (cb) => {
  setTimeout(() => {
    cb(null, 'C')
  }, 125)
}

// 1. Callback hell approach
// fnC((_,lOne) => {
//   console.log(lOne);
//   fnB((a,lTwo) => {
//     console.log(lTwo)
//     fnA((a,lThree) => {
//       console.log(lThree)
//     })
//   })
// })

// leveraging nodes's 'promisify' module
const ARes = promisify(fnA)
const BRes = promisify(fnB)
const CRes = promisify(fnC)

// Promise chaining
async function doItAsync(){
  CRes()
  .then(cLetter => {
    console.log(cLetter)
      BRes()
      .then(bLetter => {
        console.log(bLetter)
        ARes()
        .then(aLetter => {
          console.log(aLetter)
        })
      })
  })
}

// await syntax
// async function doItAsync(){
//   const c = await CRes()
//   const b = await BRes()
//   const a = await ARes()
//   console.log(c,b,a)
// }


// Promise.all syntax

async function doItAsync(){
  let allPromises =[await CRes(),await BRes(),await ARes()]
  Promise.all(allPromises).then(arr => {
    arr.map(i => console.log(i))
  })
}
doItAsync()