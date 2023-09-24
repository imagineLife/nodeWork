import natural from 'natural'

export default function buildArrOfSentences(txt) {
  // const { SentenceTokenizer } = natural;
  // const sentenceTokenizer = new SentenceTokenizer();
  // return sentenceTokenizer.tokenize(txt);
  const twoWhiteSpaces = /(\s{2})/gm;
  const sentRegex = /(~~)\s/g;

  // arr of sentences
  let sentences = txt
    .replace(twoWhiteSpaces, ' ')
    .replace(/\.\s/g, '.~~ ')
    .replace(/\?\s/g, '?~~ ')
    .replace(/!\s/g, '!~~ ')
    .split(sentRegex);
  return sentences.filter((d, idx) => idx % 2 === 0);
}
