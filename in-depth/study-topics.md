## Node Topics

[CLI && Binary](#cli-&&-binary)  
[Debugging](#debugging)
[JS](#js)

### CLI && Binary

- run flags
  - `-e`: evaluate
  - `-p`: evaluate && print
  - `-r`: require, "pre-load" a module

## Debugging

- inspect && break on first line
  - `node --inspect-brk file-to-run.js`
  - open `chrone://inspect`
- break on an error
  - use the checkbox in chrome inspect view `pause on caught exceptions`
- add breakpoints to a node process
  - in the code
    - add a `debugger` keyword where the breakpoint will be leveraged
  - in the inspector
    - add a blue 'flag' to the line number that the breakpoint will be leveraged

## JS

- proptypal Inheritance
  - Functionally
    - using `Object.create` syntax
    - levearging the `Properties Descriptor Object`
    - express how js executes the calling of a method that is NOT directly set on the parent-most Object, rather a deeply nested protype
    - inspecting the prototype of an object using `getPrototypeOf`
  - Leveraging Constructor Fns
    - using the `prototype` property of a fn
    - building an `inherit` fn, that...
      - takes a `protoProp`
      - builds a `NewObj` fn
      - attaches the `protoProp` to the prototype of the `NewObj`
      - returns a new instance of the `NewObj`
      - ...using this `inherit` fn to make 1 Constructor fn inherit another Constructor's prototype
    - leveraging the util fn `inherits` to assign the prototype of 1 obj to another
  - Leveraging Class Syntax
    - building a class `person` that
      - takes a prop `name`
      - contains a method `sayName` that logs `my name is ${this.name}`
    - build another class, `kid`
      - inherits/extends the `person` class
      - passes a prop `thisName` to the parent class (_through the construcotr + super_) but adjusts `thisName` to be a string `${thisName}, and I'm a kid`
      - include a method called `shout` and log `${this.name}: ahh!`
- levearging closure scope
  - (_similar to currying_)
  - write an example where...
    - a fn `starter` ...
      - take a prop `type`
      - contains an inner counter var, set to 0
      - returns a fn, a fn that operates on a param `name`
        - increases inner counter var by 1
        - returns an obj
        - {
          - counter
          - type
          - name
        - }
  - call the fn 1x with type `human`, name results as `createHuman`
  - call the fn 1x with type `furniture`, name result `createFurniture`
    - call `createHuman` 2 different times, storing as `bob` and `jane`
    - call `createFurniture` 1x, storing as `chair`
    - LOGGING EACH OBJECT should return
      - incrementing IDs on humans, 1,2
      - single id on furniture, 1

## Streams

- Know 5 'major' Types of streams
  - know other node core APIs that are also streams
- Know the main events on a stream
- Know the 2 stream modes
  - they read different things
- Know what streams inherit from

### Readable streams

- build a fn that returns one with the readable constructor
  - leverage the internal `read` function for pushing data on
  - leveraging the `data` event
  - leverage the encoding param for decoding incoming buffer
  - leveraging the objectMode to go without reading buffers
  - leveraging the `from` utility to more directly consume data from a js object input

### Writable streams

- build a fn that returns one with the writable constructor
  - leverage the internam `write` method in the Writable Constructor, including the **3 default params**
  - writing directly to a writable string using the `write` method
  - leveraging the `decodeStrings` option to skip converting stream input to buffers
  - leveraging the `objectMode` option to consume native js content
  - ending stream input leveraging the `end` method

### Duplex streams

- leveraging a TCP network socket as an example of a duplex stream
  - creating a `net` server
    - in the server callback,
      - set an interval of 1s to write to the socket a string of `heart-beat`
      - listen for the data event, && write back to the socket a stringified-upper-cased version of the data
    - register an end listener that clears the interval that was set in the callback
  - creating a `net` client
    - listening for the data event && logging a stringified version of the data
    - write `hello` to the socket
    - set a timeout for 3.25s that
      - writes `finished` to the socket
      - sets another internal timeout @ 250ms ending the socket connection
- understanding...
  - not everything WRITTEN to a duplex stream affects the stream output

### Transform Streams

- write a transform stream that...
  - encrypts some input with a salt string of `salted`
  - leverages the native crypto scrypt method for encrypting

### Leveraging Pipeline

- build a readable stream from a file `incoming.txt`
  - in the file put 4 paragraphs of lorem ipsum from [a generator](https://www.lipsum.com/)
  - upper-case the incoming stream
  - send the uppercased results to an output file `outgoing.txt`

#### catch the end

with the above stream example,

- use the `finished` utility to catch when the incoming stream is completed, and log a string `done parsing input`
- use the `finished` utility to catch when the outoging stream is completed, and log a string `done writing output`

## FS

- get the current executing filename
- get the absolute path to the dir that the current executing file is in
- create a cross-platform path to a file

### Paths

- understand leveargin the path utility
  - building paths
    - calculating the relative path between 2 paths
    - getting the absolute path from a small part of a path
    - normalizing path strings
  - deconstructing paths
  -

### Reading && Writing to FS

- reading a file
  - outputting to a buffer
  - outputting to an encoded string
  - blocking the proecss
  - not blocking the process
- writing to a file
  - blocking the proecss
  - not blocking the process
- leveraging flags to...
  - open a file for appending
    - creating if not existent
    - failing if path already exists
    - and for reading
    - synchronously
  - reading a file
    - returing exception if not isting
    - and writing
    - and writing, in syncronous mode
  - writing to a file
    - creating or truncating if existing

#### Reading && Writing with streams

- reading using streams
- writing using streams

### Reading Directories

- read directories

### Leveraging File Metadata (stats)

- following symbolic links
- checking is an item is a directory
- accessing time data
  - last accessed
  - last written to
  - last done ANYTHING to
  - initialized

### Watching Files

- watch a file system
  - leveraging [chokidar](https://www.npmjs.com/package/chokidar)
- try...
  - wathcing a file
  - maintaining state of the files in the dir
  - logging when...
    - a new file is added
    - a file is deleted
    - a file is updated

## Process && OS

- Interact with terminal std input && std output leveraging the process module
- pipe a cli process output to a node process file
- in a node process file, detect wether or not the file is being called from a cli process pipe or called via `node thisProcess.js`
- create stdout && stderr streams from the fs module
- force a process to exit
  - with exit code 0
  - with non-zero exit code (try 1)
- view the previous process exit code using `echo $?`
- view process info

  - current working directory of the process
  - platform that the process is running on
  - the process ID
  - env vars applied to the process

- a 3-section-process

  - from the cli, print an encrypted hex string of 25 random bytes
  - in the same cli line, pipe the results of the encrypted string to a node file `toUpper.js`
    - here, take the process' stdin
    - pipe the stdin to a transform stream that uppercases all the characters
    - pipe the results of the uppercase stream to the process stdout

- try...
  1. passing cli input to file
     1. - levearge node to print the results from a string to the terminal
     2. - in the same line, pipe to a file that pipes stdin to the stdout
  2. passing cli input to a file that...
     1. pipes cli input to an uppercase transform stream
     2. pipes that to the stdout
     3. EXTRA CREDIT
        1. in the file, log wether or not the file is getting called directly from a cli pipe OR by its name
  3. through the terminal, pipe the above #2 from the node file to an output text file - **skip logging anything custom** to avoid adding the custom logs into the output file


## Child Processees
- name the methods that node gives for creating child processes
  - including the options that executes a file, rather than a command passed in the shell
  - what is the best practice for executing the node binary as a child process
    - ANSWER: refer to the full path of the node binary of the cur process
      - `process.execPath`


### 