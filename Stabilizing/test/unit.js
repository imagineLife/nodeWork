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

// Assert that the getANumber function is returning 1
unit['helpers.getANumber should return 1'] = function(done){
  var val = helpers.getANumber();
  assert.equal(val, 1);
  done();
};

// Assert that the getANumber function is returning 2
unit['helpers.getNumberOne should NOT return 2'] = function(done){
  var val = helpers.getANumber();
  assert.notEqual(val, 2);
  done();
};

// Logs.list should callback an array and a false error
unit['logs.listLogs should callback a false error and an array of log names'] = function(done){
  logs.listLogs(true,function(err,logFileNames){
      assert.equal(err, false);
      assert.ok(logFileNames instanceof Array);
      assert.ok(logFileNames.length > 1);
      done();
  });
};


// Export the tests to the runner
module.exports = unit;