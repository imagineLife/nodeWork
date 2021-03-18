/*
  - assert against a mock async fn, leveraging setTimeout, that takes a callback
  - does not return error appropriately
  - returns an expected error
*/ 

const { rejects, doesNotReject } = require('assert');
const THROWER = Error('thrown')



// V1, raw promise fn

// function promiseMockAsync(cb, boolParam){
//   return new Promise((res, rej) =>{
//     if(boolParam == true) rej(THROWER);
//     setTimeout(() => {
//       res(true)
//     }, 1000)
//   })
// }

// rejects(promiseMockAsync(() => {}, true), THROWER)
// doesNotReject(promiseMockAsync(() => {}, false), THROWER)






// V2, with promisify utility
const { promisify } = require('util')

function asyncWait(cb, boolParam){
  setTimeout(() => {
    if(boolParam == true) cb(THROWER);
    cb(null, true)
  },800)
}

const promiseVersion = promisify(asyncWait)

rejects(promiseVersion(() => {}, true), THROWER)
doesNotReject(promiseVersion(() => {}, false), THROWER)