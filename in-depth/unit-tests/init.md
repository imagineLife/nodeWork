# Unit Tests

- testing code
- checks if things match
- throws if not matching
- `assert` module
  - throws an `AssertionError` when val is falsy
  - does "nothing" on success

## Assert Module Methods

- `ok(val)`
  - same as `assert(val)`
- `equal(a,b)`
  - a == b
- `notEqual(a,b)`
  - a != b
- `strictEqual(a,b)`
  - a === b
- `notStrictEqual(a,b)`
  - a !== b
- `deepEqual(a,b)`
  - cooercive deep equaling of all vals in an obj
- `notDeepEqual(a,b)`
  - cooercive deep unequality comparison of all vals in an obj
- `deepStrictEqual(a,b)`
  - strict equal for all vals in an obj
- `notDeepStrictEqual(a,b)`
  - strict unequal for all vals in an obj
- `throws(fn)`
  - asserts that a fn throws
- `doesNotThrow(fn)`
  - asserts a fn doesn't throw
- `rejects(promise-or-async-fn)`
  - asserts the promise, or async fn, rejects
- `doesNotReject(promise-or-async-fn)`
  - asserts that the promise resolves
- `ifError(errObj)`
  - asserts err object is falsy
- `match(str,regex)`
  - asserts string fits in regex
- `doesNotMatch(str,regex)`
  - str fails on regex
- `fail()`
  - force an `AssertionError` to throw

## Grouping Assert Methods

- Check for thruthiness
  - assert
  - assert.ok
- Equality
  - strict && loose
  - pattern matching
- Deep Equality
  - ifError
  - throws
  - rejects
- Unreachability
  - fail

## All That is needed

- there are other testing libraries
- the more 'complpex' the test, the more use-case-speific the test will be, proving less-valuable over time

## Deprecated Modules as of node 15.x

- `deepEqual`
  - use `deepStrictEqual`
- `notDeepEqual`
  - use `notDeepStrictEqual`
- `equal`
  - use `strictEqual`
- `notEqual`
  - use `notStrictEqual`
- `fail`
  - use .... `fail([message])`?


## More Notes
- `deepEqual` is different than `deepStrictEqual`
  - `deepEqual` will pass on 2 objects where...
    - 1 primitive value is a string "1"
    - 1 primitive value is a number 1
  - `deepStrictEqual` will fail on that comparison
- error handling assertions
  - `throws`
  - `ifError`
  - `rejects`
    - useful for asserting errors are occuring in async logic


## AssertionErros
- when an assertion fails, an `AssertionError` i shtrown
- this causes the process to crash
- all following assertions dont run, in this case
- `Test Harnesses` group tests together
  - Pure (_library_)
  - Jest (_library_)