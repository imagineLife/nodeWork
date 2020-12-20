const uc = require('./uppercase')
const assert = require('assert')

const { equal, throws } = require('assert')

const ASSUMED_FAIL_ERR = Error('input must be a string')
equal(uc('water'), 'WATER'); 
throws(() => uc(123), ASSUMED_FAIL_ERR)