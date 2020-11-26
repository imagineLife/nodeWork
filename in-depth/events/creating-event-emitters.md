# Creating Event Emitters

```js
const { EventEmitter } = require("events");

// one way of making an event object
const dataHandler = new EventEmitter();

// a more 'traditional' way
class dataHandler extends EventEmitter {
  constructor(opts = {}) {
    super(opts);
    this.name = opts.name;
  }
}
```

## Emitting Events

```js
dataHandler.emit("event-name", { ...eventParams });
```

## Listening For Events

```js
dataHandler.on("event-name", handleParamsFn);
```
