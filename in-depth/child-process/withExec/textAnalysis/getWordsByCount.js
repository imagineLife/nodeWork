// creates an object of the most-frequent words occuring
export default function getWordsByCount(srcWordArr, dontSkipFreqWords) {
  // const startingArr = typeof srcWordArr === 'string' ? convertStrToWordArr(srcWordArr) : srcWordArr;

  // https://en.wikipedia.org/wiki/Most_common_words_in_English
  const topThirty = [
    'the',
    'be',
    'to',
    'of',
    'and',
    'a',
    'in',
    'that',
    'have',
    'i',
    'it',
    'for',
    'not',
    'on',
    'with',
    'he',
    'as',
    'you',
    'do',
    'at',
    '',
    'this',
    'but',
    'his',
    'by',
    'from',
    'they',
    'we',
    'say',
    'her',
    'she',
  ];
  const freqUsedWords = [];

  // startingArr
  srcWordArr.forEach((singleWord) => {
    const lowerCaseWord = singleWord.toLowerCase();
    let thisIndex = null;
    // check if this word is already in array
    if (
      freqUsedWords.some((arrObj, arrObjInd) => {
        if (arrObj.word == lowerCaseWord) {
          thisIndex = arrObjInd;
        }
        return arrObj.word == lowerCaseWord;
      })
    ) {
      freqUsedWords[thisIndex].occurrences += 1;
    } else {
      // if this word is NOT in the topThirty array, add to freqWords
      if (!topThirty.includes(lowerCaseWord) && !dontSkipFreqWords) {
        freqUsedWords.push({ word: singleWord.toLowerCase(), occurrences: 1 });
      } else return;
    }
  });

  freqUsedWords.sort((a, b) => b.occurrences - a.occurrences);
  return freqUsedWords;
}



export function mergeWordsByCount(older, newer) {
  let innerOld = older;
  newer.forEach((newWordObj) => {
    // is there a pre-existing obj in innerOld
    let matchingOldItem = {
      idx: null,
      occurrences: null,
      word: null,
    };

    const alreadyThere = innerOld.find((io, idx) => {
      if (io.word === newWordObj.word) {
        matchingOldItem = {
          ...io,
          idx,
        };
        return true;
      }
    });
    if (alreadyThere) {
      innerOld[matchingOldItem.idx].word = matchingOldItem.word;
      innerOld[matchingOldItem.idx].occurrences = matchingOldItem.occurrences + newWordObj.occurrences;
    } else {
      innerOld.push(newWordObj);
    }
  });
  return innerOld;
}
