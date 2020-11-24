# Closure Scope

```js
function outerFn() {
  let a = true;

  function inner() {
    console.log("inner");
    console.log(a);
  }
  inner();
  a = false;
  inner();
}
outerFn();
```

Inner functions have access to out function scope
