/*
   converts 
    'the quick brown fox jumps over the lazy dog.'
    
    to 
      [
        'the',   'quick',
        'brown', 'fox',
        'jumps', 'over',
        'the',   'lazy',
        'dog'
      ]
*/
const convertStrToWordArr = (str) => {
  // gets rid of line-break or whatever
  const newReg = /(^)?\s*$/gm;

  // remove some punc
  const puncRegEx = /[.,-]/g;

  // apply regex
  const regexTxt = str.replace(newReg, '').replace(puncRegEx, '');

  // split txt into arr of words
  return regexTxt.split(' ');
};

export default convertStrToWordArr;
