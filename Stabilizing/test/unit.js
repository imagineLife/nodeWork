/*
 * Unit Tests
 *
 */

// Dependencies
var helpers = require('./../lib/helpers.js');
var logs = require('./../lib/logs.js');
var exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem.js');
var assert = require('assert');

// Holder for Tests
var unit = {};

// Assert that the getANumber function is returning a number
unit['helpers.getANumber should return a number'] = function(done){
  var val = helpers.getANumber();
  assert.equal(typeof(val), 'number');
  done();
};

// Export the tests to the runner
module.exports = unit;