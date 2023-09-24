import natural from 'natural';

export default function setupNLPTools() {
  // https://naturalnode.github.io/natural/sentiment_analysis.html
  const { PorterStemmer, SentimentAnalyzer } = natural;
  const language = 'English';

  const SENTIMENT_TYPE = 'afinn';
  const affinityAnalyzer = new SentimentAnalyzer(language, PorterStemmer, SENTIMENT_TYPE);
  return { affinityAnalyzer };
}
