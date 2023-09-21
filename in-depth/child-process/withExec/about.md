managing analytics through child_processes

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
  - 