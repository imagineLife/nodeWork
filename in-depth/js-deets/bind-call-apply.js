function addToThis(a){
  return this.num + a;
}

function addAFew(a,b,c){
  return this.num + a + b + c;
}

let o = {
  num: 2
}

let bigO = {
  num: 14
}

/*
  CALL
  functionName.call(focusObj, fnParams)
  - does NOT alter o.num
  - returns the RESULT, not altering the value
*/ 
let newNum = addToThis.call(o,4);
console.log({newNum})

// params can be added as a list
let biggerNum = addAFew.call(o,2,3,4)
console.log({biggerNum})

/*
  APPLY!
  like call but can take an arr
*/
let argsArr = [3,4,5]
let bigAgain = addAFew.apply(o,argsArr);
console.log({bigAgain})

let biggerArgsArr = [4,5,6]
let evenBig = addAFew.apply(bigO,biggerArgsArr);
console.log({evenBig})


/*
  BIND
  does NOT give the result when logged result
  below, returns a fn
*/ 
let bindOne = addToThis.bind(o,4);
console.log({bindOne})
console.log({bindOne: bindOne.toString()})