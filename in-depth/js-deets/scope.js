/*
  SCOPE
  - where to look for stuff
  
  A VARIABLE is either...
    -  getting assigned a value
      let x = "string"
    - recalling a previously stored value
      console.log(x)
  
  A COMPILER 'figures out' the scope
  - compiling is a step within js
  - js doesnt REALLY run top-down
    - JS is not an interpreted language, it is compiled
    - ... or at leasted PARSED if not compiled
    - i.e when a syntax error is present, the WHOLE PROGRAM does not run
    - THIS is unlike bash...
      - bash will run 1-9 when there's an error on line 10
  - COMPILER THEORY, 4 stages
    - lexing
    - tokenization
    - parsing - turns stream of tokens into abstract syntax tree
    - code generation - take abs. synt. tree && producting executable form of a program
    - the code is PROCESSED before EXECUTION
  - SHADOWING
    - 2 vars, same name, different execution contexts
  - Lexical Scoping
    - when an item is not found by the runner/compiler, look in the 'parent' scope

*/ 


