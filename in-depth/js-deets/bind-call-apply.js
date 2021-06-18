function addToThis(a){
  return this.num + a;
}

function addAFew(a,b,c){
  return this.num + a + b + c;
}

let o = {
  num: 2
}

/*
  CALL
  functionName.call(focusObj, fnParams)
  - does NOT alter o.num
  - returns the RESULT, not altering the value
*/ 
let newNum = addToThis.call(o,4);
console.log({newNum})

let biggerNum = addAFew.call(o,2,3,4)
console.log({biggerNum})

let argsArr = [3,4,5]
let bigAgain = addAFew.apply(o,argsArr);
console.log({bigAgain})





