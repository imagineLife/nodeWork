/*
  3 Fns that are awaiting a response
  Goal to have output read C then B then A
*/

// for 2nd+ approach
// const { promisify } = require('util');

const LONG_TIME = 500;
const MID_TIME = 250;
const SHORT_TIME = 125;

function longestFn(cb) {
  console.log('2');
  setTimeout(() => {
    console.log('9');
    cb(null, `Longest wait done`);
  }, LONG_TIME);
}

function midFn(cb) {
  console.log('4');
  setTimeout(() => {
    console.log('8');
    cb(null, `mid wait done`);
  }, MID_TIME);
}

function shortestFn(cb) {
  console.log('6');
  setTimeout(() => {
    console.log('7')
    cb(null, `shortest wait done`);
  }, SHORT_TIME);
}

function printResOrErr(err, s) {
  if (err) {
    console.error(err);
  } else {
    console.log(s);
  }
}
// 
// TODO:
// call in this order: fnA then fnB then fnC 
//    this is longest-to-shortest
// get the LOG ORDER to be C then B then A
//    this is shortest-to-longest
console.log('1');
longestFn(printResOrErr);
console.log('3');
midFn(printResOrErr);
console.log('5');
shortestFn(printResOrErr);