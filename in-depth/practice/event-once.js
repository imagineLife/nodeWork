/*
  GOALS
  - build 'global' count var, set to 0
  - build an event emitter
  - build an interval that emits 
    a 'tick' event to the event emitter
    every 100ms
  - build a listener fn
    - increments the count var
    - runs a setTimeout fn, timeout = 250ms
      - asserts count is 1
      - asserts 'this' is ee
      - logs 'passed'

*/ 

const {equal} = require('assert');
const { EventEmitter } = require('events');
let gloablCount = 0;

const e = new EventEmitter()

let TICK_EMIT_TIME = 100
let ASSERT_TIME = 250

function emitATick(){
  e.emit('tick')
}

/*
  TRIED this as the fn in the setTimeout listener
  the `this` assertion failed
*/ 
// function asserter(){
//   equal(gloablCount, 1)
//   equal(this, e)
//   console.log('passed!')
// }

function listener(){
  gloablCount++
  setTimeout(() => {
    equal(gloablCount, 1)
    equal(this, e)
    console.log('passed!')
  }, ASSERT_TIME)
}

setInterval(emitATick,TICK_EMIT_TIME)

e.once('tick', listener)

