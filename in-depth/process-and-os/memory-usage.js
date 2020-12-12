const ITERATION_COUNT = 10000
const statsArr = [process.memoryUsage()]

let rows = 14;

while(rows--){
  const arr = []
  let i = ITERATION_COUNT;

  // make cpu do random work
  while(i--){
    arr.push({[Math.random()]: Math.random()})
  }
  statsArr.push(process.memoryUsage())
}

console.table(statsArr);