export default function getLongestThirty(inputVar) {
  const howMany = 30
  // const startingArr = typeof inputVar === 'string' ? convertStrToWordArr(inputVar) : inputVar;

  // make NO REPEATS
  const uniqueWords = inputVar.reduce((acc, val) => {
    //startingArr
    if (acc.indexOf(val.toLowerCase()) < 0) acc.push(val.toLowerCase());
    return acc;
  }, []);

  // sort the word by longest-at-the-top
  uniqueWords.sort((a, b) => b.length - a.length);

  const res = uniqueWords.slice(0, howMany);

  return res;
}
