const { equal, strictEqual } = require('assert')

// Fn Def
function add (a,b){ return a + b }

// Passes
equal(add(2,2), 4); 
strictEqual(add(3,5),8

// Fails
const thisRes = add(2,3);
const stringVal = '5';
// equal('number', typeof stringVal)
// returns AssertionError [ERR_ASSERTION]: 'number' == 'string'