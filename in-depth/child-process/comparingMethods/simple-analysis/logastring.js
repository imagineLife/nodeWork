// console.log({
//   idx: process.env.idx,
//   sentence: process.env.text
// })
console.log(JSON.stringify({ splitCount: process.env.text.split(' ').length, pid: process.pid }));
