## managing analytics through child_processes

### What Happens
RUN sentence-by-sentence
- take arr of sentences
- captureThemes
- longest
- sentimentScore

MAX 3 child-processes

PARALLEL CHILD_PROCESSES
- take all sentences
- start process
  - get first three sentences
  - kick-off 3x child child-processes
  - each process runs the (4x?!+ manual sentiment stuff?!) analytics



## several files
- `parent` runs a parent process & uses the `exec` method for executing child_processes
- `parentExecFile` runs a parent process & uses the `execFile` method for executing child_processes
