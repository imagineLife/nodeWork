function prefixer(str){
  return function (obj){
    return `${str}${obj}`
  }
}

const sayHiTo = prefixer('Hello ')
const sayByeTo = prefixer('Goodbye ')
console.log(sayHiTo('Sal')) // prints 'Hello Sal'
console.log(sayHiTo('Mark')) // prints 'Hello Mark'
console.log(sayByeTo('Quan')) // prints 'Goodbye Quan

/*
  closure is similar to the functional-programming tool of currying

  the currying version would look like...
  
  const prefixer = x => y => `${x}${y}`

*/ 