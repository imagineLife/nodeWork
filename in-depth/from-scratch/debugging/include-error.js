const L = 3;
const H = 12;

for (let i = L; i <= H; i++){
  let halfI = i / 2;
  if(halfI === 6) throw Error('water');
  console.log({halfI})
}