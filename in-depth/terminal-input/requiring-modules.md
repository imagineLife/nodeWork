# Requiring Modules

- `-r`

## Steps

- have a module

```js
console.log("module loaded!");
```

- use `-r` flag to load the module, then start the node shell with the module in memory

```bash
node -r ./dummy-module.js
dummy module loaded!
Welcome to Node.js v14.15.0.
Type ".help" for more information.
>
```

### Naming export content

named-export.js

````js
module.export = thisFn = () => { console.log("thisFn ran")}
```bash
node -r ./dummy-module.js
````

returns...

```bash
Welcome to Node.js v14.15.0.
Type ".help" for more information.
```

then enter...

```bash
thisFn()
```

returns...

```bash
thisFn ran
```
