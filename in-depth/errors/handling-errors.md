# Handling Errors

_Case_: an error occurs from a `validateEven` fn by passing an odd value

## Try Catch case

```js
// The Error
class MustBeEvenError extends Error {
  constructor(oddValue = "") {
    super(oddValue + " must be even");
    this.code = "ERR_MUST_BE_EVEN";
  }
  get name() {
    return "MustBeEvenError";
  }
}

// the fn
function validateEven(amount) {
  if (typeof amount !== "number")
    throw new TypeError("amount must be a number");
  if (amount <= 0) throw new RangeError("amount must be greater than zero");
  if (amount % 2) throw new MustBeEvenError(amount);
  return amount / 2;
}

// run the fn, see error thrown in console
try {
  const isEven = validateEven(3);
  console.log({ isEven });
} catch (e) {
  console.error(`Error validating even ->`, e);
}

/*
  returns...
  
  Error validating even -> MustBeEvenError: 3 must be even
    at validateEven (REPL17:4:25)
*/
```

## Checking The Type Of Error

In the catch, can 'interpret' the error type...

```js
try {
  const isEven = validateEven(4);
  console.log({ isEven });
} catch (err) {
  if (err instanceof TypeError) {
    console.error("wrong type");
  } else if (err instanceof RangeError) {
    console.error("out of range");
  } else if (err instanceof MustBeEvenError) {
    console.error("cannot be odd");
  } else {
    console.error("Unknown error", err);
  }
}
```

In the catch, can 'interpret' the error code...

```js
try {
  const isEven = validateEven(4);
  console.log({ isEven });
} catch (err) {
  if (err instanceof TypeError) {
    console.error("wrong type");
  } else if (err instanceof RangeError) {
    console.error("out of range");
  } else if (err.code === "ERR_MUST_BE_EVEN") {
    console.error("cannot be odd");
  } else {
    console.error("Unknown error", err);
  }
}
```
