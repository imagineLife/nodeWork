/*
  - assert against a mock async fn, leveraging setTimeout, that takes a callback
  - does not return error appropriately
  - returns an expected error
*/ 

const { rejects, doesNotReject } = require('assert');

const THROWER = Error('thrown')

function mockFetch(cb, boolParam){
  return new Promise((res, rej) =>{
    if(boolParam == true) rej(THROWER);
    setTimeout(() => {
      res(true)
    }, 1000)
  })
}

rejects(mockFetch(() => {}, true), THROWER)
doesNotReject(mockFetch(() => {}, false), THROWER)