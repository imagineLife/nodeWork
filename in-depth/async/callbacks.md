# Callbacks

- a fn that gets called at some time in the future
  - once the task has been completed
  - WAS the ONLY way to manage async flow before async/await

## Serial Execution

- in order to make multiple async logical elements _depend on previous async efforts_, callback hell became a thing...

```js
fs.readFile(f1Name, (err, f1) => {
  fs.readFile(f2Name, (err, f2) => {
    fs.readFile(f3Name, (err, f3) => {
      console.log("done!");
    });
  });
});
```

above, f2 && f3 happen after f1. The nested implementation became known as callback hell
