# Terminal Input

[See Input Options](#see-input-options)  
[See V8 Options](#see-v8-input-options)  
[Validate Syntax of a file](#check-syntax-of-a-program)

https://nodejs.org/api/cli.html

## see input options

```bash
node --help
```

## see v8 input options

```bash
node --v8-options
```

## check syntax of a program

```bash
node --check programFile.js
node -c programFile.js
```

- validate that the code 'parses':
  - for sensitive db-affecting code
  - for auto-generated code, by something else?!
  - **on success**: no output
  - **on failure**: error gets printed in output

### Example

broken.js

```js
const wat = "This is a broken string
```

```bash
node -c broken.js
```

```bash
const wat= "this is a broken string
           ^^^^^^^^^^^^^^^^^^^^^^^^

SyntaxError: Invalid or unexpected token
    at wrapSafe (internal/modules/cjs/loader.js:979:16)
    at checkSyntax (internal/main/check_syntax.js:66:3)
    at internal/main/check_syntax.js:39:3
```
