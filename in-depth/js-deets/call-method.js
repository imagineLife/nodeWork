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
  console.log('BOX')
  console.log(this)
  this.height = h;
  this.width = w;
  console.log(`Box: H-${this.height}, W-${this.width}`)
}

function Widget(h,w,c){
  console.log('WIDGET')
  console.log(this)
  Box.call(this, h,w);
  this.color = c;
  console.log(`Widget: H-${this.height}, W-${this.width}`)
}

let w = new Widget('orange',20,10);
console.log('w result ->')
console.log(w)
