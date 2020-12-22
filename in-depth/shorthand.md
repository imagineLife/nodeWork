# Shorthand notes

## CLI args

#### Check Syntax

`node -c file.js`  
`node -check file.js`

- parses js without running it
- no output on success
- error prints on fail

#### Evaluate From Shell

##### Print Results

`node --print "string-to-evaluate"`  
`node -p "string-to-evaluate"`

- prints results

##### Evaluate Results

`node --eval "console.log(1 + 3)"`  
`node -e "console.log(1 + 3)"`

- evaluates. does not print
- **HERE** the evaluation results in printing to stdout because the string includes console.log

- NOTE
  - console.logs return an `undefined`, so `undefined` returns after the string is completed

#### PreLoad a Module

- `node -r`
- `node —require`
- `node -r preloadingfile.js real-file.js`
  - useful when the pre-loaded file is used to configure the process

## Debugging

`--inspect`

- starts inspect mode

`--inspect-brk`

- tell the process to start with an active breakpoint at the beginning
- to USE the inspect && debugging process
  - open chrome
  - navigate to `chrome://inspect`
  - click the `inspect` link under the **Target** header
  - assure the `Sources ` tab is open
    - `F9` will be the tool for navigating, step-by-step, through the code
