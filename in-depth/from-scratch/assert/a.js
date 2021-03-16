const { deepStrictEqual } = require('assert')

const obj = {
  f: "Harry",
  l: "Hendsan",
  num: "3"
};

deepStrictEqual(obj, {
  f: "Harry",
  l: "water",
  num: "3"
})