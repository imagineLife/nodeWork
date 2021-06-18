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
  below, returns a "bound" function
  binds the function to the bind recieved object
*/ 
let bindOne = addToThis.bind(o,4);
console.log({bindOne})
console.log({bindOne: bindOne.toString()})

let addToO = addToThis.bind(o);
console.dir(addToO)
console.dir(addToO.toString())
let addedTo0 = addToO(14)
console.log({addedTo0})


let personOne = {
  name: 'Joe',
  job: 'mailman'
};

let personTwo = {
  name: 'Wanda',
  job: 'wizard'
};

function talkAboutMe(favFood){
  console.log(`** TALK ABOUT ME THIS`)
  console.log(this)
  return `I'm ${this.name} and I'm a ${this.job} and my fav food is ${favFood}`
}

const aboutJoe = talkAboutMe.bind(personOne)


console.log(aboutJoe('pizza'))
const aboutWanda = talkAboutMe.bind(personTwo)
console.log(aboutWanda('salmon'))