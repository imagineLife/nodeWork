/*
  1
  leveraging the global 'this'
*/
function add(a,b){ return a + b };
let r = add.call(this,2,3);
// logs 5

/*
  2, chaining constructor && call
*/
function Box(h,w){
  console.log('3. BOX')
  console.log(`4. box this -> ${this}`);
  this.height = h;
  this.width = w;
  console.log(`5. Box: H-${this.height}, W-${this.width}`)
}

function Widget(h,w,c){
  console.log('1. WIDGET')
  console.log(`2. Widget THIS ${this}`)
  Box.call(this, h,w);
  this.color = c;
  console.log(`6. Widget: H-${this.height}, W-${this.width}`)
}

let w = new Widget(20,10,'orange');
console.log('7. w result ->')
console.log(w)
