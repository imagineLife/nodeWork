export default function getLongestWord(arr) {
  return arr.reduce((a, b) => (a.length > b.length ? a : b));
}
