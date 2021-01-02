- [Shorthand notes](#shorthand-notes)
  - [CLI args](#cli-args)
      - [Check Syntax](#check-syntax)
      - [Evaluate From Shell](#evaluate-from-shell)
        - [Print Results](#print-results)
        - [Evaluate Results](#evaluate-results)
      - [PreLoad a Module](#preload-a-module)
  - [Debugging](#debugging)
    - [Leveraging CLI options](#leveraging-cli-options)
    - [Adding A Breakpoint](#adding-a-breakpoint)
  - [Functions](#functions)
    - [Scoped THIS keyword](#scoped-this-keyword)
    - [Calling objects on functions](#calling-objects-on-functions)
  - [Prototypical Inheritance](#prototypical-inheritance)
    - [Functionally](#functionally)
    - [Using Constructor Functions](#using-constructor-functions)
    - [With Class-Syntax Constructor](#with-class-syntax-constructor)

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

### Leveraging CLI options

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

### Adding A Breakpoint

`node --inspect-brk file-name.js`

- start the thing in inspect-brk mode
- click a line-number in the sources output
- click the blue arrow on the right

`node inspect file-name.js`

- **leverage a "debugger" keyord in the code before starting**
- starthe the thing in inspect mode
- open the chrome inspector (_see above_)

## Functions

### Scoped THIS keyword

- when fn is assigned to an obj
  - the `this` keyword within the fn REFERS TO THE OBJ on which the fn was called

```js
const a = {
  id: 123,
  fn: function () {
    console.log(this.id);
  },
};
const b = { id: 234, fn: a.fn };

a.fn(); //123
b.fn(); //234
```

### Calling objects on functions

- fns have a `call` method
- the `call` method can be used to set the fns `this` context

```js
function doIt() {
  console.log(this.water);
}
const a = { water: "melon" };
const b = { water: "slide" };
doIt.call(a); //melon
doIt.call(b); //slide
```

## Prototypical Inheritance

### Functionally

see `practice/inheriting.js` for a more robust example

```js
// the 'parent' or 'base' obj
const animal = {
  about: `A lovely animal`,
  sayItAll: `${this.name}, ${this.about} ${this.canDo}`,
};

// consuming the base obj, creating
const dog = Object.create(animal, {
  canDo: { value: "that can bark" },
});

// consuming the above obj
const ralph = Object.create(dog, {
  name: { value: `Ralph` },
});
```

### Using Constructor Functions

see `practice/constructor.js` for a more robbust example

- create a fn
  - take a name param
  - dont return anything
  - assign `this.name = name`

### With Class-Syntax Constructor
