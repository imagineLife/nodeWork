// 1
function divideByTwo(n){
  if(typeof n !== 'number') throw new Error('not a number')
  return n / 2
}
// const res = divideByTwo('a') // THROWS
// const res = divideByTwo(18) // WORKS
console.log({res})

