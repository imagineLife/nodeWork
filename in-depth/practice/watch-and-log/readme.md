## Watch And Log
An example of a node service using the node api.

### Goals
- **Watch** a directory && 'know' when...
  - files are added from the dir
  - files are changed from the dir
  - files are deleted from the dir
- Build an EventEmitter that...
  - logs file activity in the watched dir, logging...
    - each event 'type'
    - time of event trigger
  - 