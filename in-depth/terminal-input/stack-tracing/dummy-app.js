function f (n = 102) {
  console.log(`N : ${n}`);
  if (n === 0) {
    throw Error();
  }
  f(n - 1)
}
f()