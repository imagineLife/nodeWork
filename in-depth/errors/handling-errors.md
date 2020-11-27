# Handling Errors

_Case_: an error occurs from a `validateEven` fn by passing an odd value

## Try Catch case

```js
try {
  const isEven = validateEven(3);
  console.log({ isEven });
} catch (e) {
  console.error(`Error validating even ->`, e);
}
```
