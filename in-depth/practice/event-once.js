/*
  GOALS
  - build 'global' count var, set to 0
  - build an event emitter
  - build an interval that emits 
    a 'tick' event to the event emitter
    every 100ms
  - build a listener fn
    - increments the count var
    - runs a setTimeout fn, timeout = 250ms
      - asserts count is 1
      - asserts 'this' is ee
      - logs 'passed'

*/ 