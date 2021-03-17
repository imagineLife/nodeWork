// Shallow coercive equality
const { equal } = require('assert');

// these pass
equal({a: "1"}, {a: 1}, 'meh')
equal(1, "1")





// deepStrictEqual({a: "1", b: {c: "1"}}, {a: "1", b: {c: 1}}, 'meh')
