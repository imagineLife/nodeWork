const ITERATION_COUNT = 10000
const statsArr = [process.memoryUsage()]

let rows = 5;

while(rows--){
  const arr = []
  let i = ITERATION_COUNT;

  // make cpu do random work
  while(i--){
    arr.push({[Math.random()]: Math.random()})
  }
  statsArr.push(process.memoryUsage())
}

console.table(statsArr);

/*
  OUTPUT
  ┌─────────┬──────────┬───────────┬──────────┬──────────┬──────────────┐
  │ (index) │   rss    │ heapTotal │ heapUsed │ external │ arrayBuffers │
  ├─────────┼──────────┼───────────┼──────────┼──────────┼──────────────┤
  │    0    │ 19324928 │  4468736  │ 2577288  │  800217  │     9386     │
  │    1    │ 23085056 │  9457664  │ 6070352  │  800257  │     9386     │
  │    2    │ 30834688 │ 16850944  │ 9007824  │  800257  │     9386     │
  │    3    │ 33476608 │ 17637376  │ 12209616 │  800257  │     9386     │
  │    4    │ 38035456 │ 20262912  │ 14580968 │  800257  │     9386     │
  │    5    │ 41398272 │ 22884352  │ 16035944 │  800257  │     9386     │
  └─────────┴──────────┴───────────┴──────────┴──────────┴──────────────┘

  What it means
  - SEE DOCS
    https://nodejs.org/api/process.html#process_process_memoryusage

  - #s from `process.memoryUsage()` are output in bytes
  - rss
    - Resident Set Size
    - amt of space taken in 'main memory device' for the process
      - includes all C++ AND JS objs && code
    - amt of used RAM for the process
  - heapTotal
    - V8s Memory Usage
    - memory allocated for the proces
  - heapUsed
    - V8s Memory Usage
    - RAM used across RAM AND 'swap space'
  - external
    - memory used by the C++ layer
    - once the JS engine has 'fully initialized' - no more memory gets used
  - arrayBuffers
    - memory allocated for ArrayBuffers && SHaredArrayBuffers, including all Node Buffers
    - included in `external` value
  
*/
