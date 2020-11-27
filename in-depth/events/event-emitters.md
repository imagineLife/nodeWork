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

- the ORDER of emitting && listening matters...
  - if emit is written before the listener, the listener will not catch the emit

## prependListener

- a method on the eventEmitter
- registers at the beginning of the listeners array for the given event
- can be written out-of-order, and will ALWAYS 'handle' an event even when the `.on` is written after prependListener

```js
dataHandler.prependListener("event-name", prependFn);
```

## once

```js
dataHandler.once("single-event-instance-handler", singleHandler);
dataHandler.emit("single-event-instance-handler");
dataHandler.emit("single-event-instance-handler");
```

- the event removes itself after it is called once
- emitting the even _again_ will do nothing && throw no error
