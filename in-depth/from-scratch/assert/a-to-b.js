// Shallow coercive equality
// const { equal } = require('assert');

// these pass
// equal({a: "1"}, {a: 1}, 'meh')
// equal(1, "1")





const { strictEqual } = require('assert');

// these fail
// strictEqual({a: "1"}, {a: 1}, 'meh')
// strictEqual(1, "1")

// these pass
const a = {a: "1"}
strictEqual(a, a, 'meh')
strictEqual(1, 1, 'same number')
