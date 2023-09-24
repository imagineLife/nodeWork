// import natural from 'natural';

export default function buildArrOfWords(s) {
  // const { WordTokenizer } = natural;
  // const wordTokenizer = new WordTokenizer();
  // return wordTokenizer.tokenize(s);
  let sentenceArr = s.match(/\S+\s*/g)
  if (!sentenceArr) { 
    console.log(`cannot buildArrOfWords from input: ${s}`)
    return;
  }
  return sentenceArr.map((w) => w.replace(' ', '').replace('.', ''));
}
