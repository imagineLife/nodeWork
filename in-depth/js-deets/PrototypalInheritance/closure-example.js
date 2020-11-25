'use strict';
function setPrefix(str){
  let resString = `${str}`
  return function(followUpStr){
    return `${resString}${followUpStr}`
  } 
}

const sayHiTo = setPrefix('Hello ')
const sayByeTo = setPrefix('Goodbye ')
console.log(sayHiTo('Dave')) 
console.log(sayHiTo('Annie')) 
console.log(sayByeTo('Dave'))