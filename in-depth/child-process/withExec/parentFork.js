/*
  DIFFERENCES between this and the other exec+spawn examples
  - HERE the 2 analysis files are a bit different: they are "fork" files and include `process` code - they "know" they are processes
*/ 
console.time('shebang')
const { fork } = require('child_process');
const sentences = require('./sentences')
const waysToAnalyze = [
  {
    file: './simple-analysis/logastring-fork.js',
    name: 'logAString',
  },
  {
    file: './simple-analysis/countLength-fork.js',
    name: 'countLength',
  },
];

let forks;
let sentencesDone = 0;



function setupForks() { 
  console.log('setting up forks')
  return new Promise(res => {
    forks = waysToAnalyze.map((way, wayIdx) => {
      console.log(`Creating a fork of ${way.name}`);
      const childProcess = fork(way.file);
      childProcess.on('message', (message) => {
        handleProcessResponse({ ...message, forkIdx: wayIdx});
      });
      return childProcess;
    });
    res(true);
   })
}



function killForks() { 
  forks.forEach((f) => {
    f.send({ kill: true });
  });
  console.timeEnd('shebang');
}



function checkAnalysisDone(sentenceIdx) {
  let doneAnalyzingCurSentence = Object.keys(sentences[sentenceIdx]).length === waysToAnalyze.length + 1;
  const isProcessingLastSentence = sentenceIdx === sentences.length - 1;
  if (doneAnalyzingCurSentence && sentencesDone < sentenceIdx + 1) {
    sentencesDone = sentencesDone + 1;
  }  

  const moreSentencesToBeDone = sentencesDone !== sentences.length;
  
  // Completely done!
  const isDone = doneAnalyzingCurSentence && !moreSentencesToBeDone && isProcessingLastSentence
  if (isDone) {
    console.log('DONE-ZO?!');
    killForks()
    return;
  }

  if (doneAnalyzingCurSentence && moreSentencesToBeDone && !isDone) {
    processSentenceByIndex(sentenceIdx + waysToAnalyze.length);
  }
}



function handleProcessResponse(processResponse) {
  let { sentenceIdx, analysis: dataToStore, forkIdx } = processResponse;

  
  // let originalSentenceText;
  // prep resulting analytics object per sentence
  let curSentenceText =
    typeof sentences[sentenceIdx] === 'string' ? sentences[sentenceIdx] : sentences[sentenceIdx].text;
  
  let dataForSentence = {
    ...dataToStore,
  }
  if (typeof sentences[sentenceIdx] !== 'string') {
    dataForSentence = {
      ...sentences[sentenceIdx],
      ...dataToStore,
    }
  }

    sentences[sentenceIdx] = {
      text: curSentenceText,
      ...dataForSentence,
    };
  checkAnalysisDone(sentenceIdx);
} 


function processSentenceByIndex(sentenceIdx) {
  if (sentenceIdx < sentences.length) {
    forks.forEach((f) => {
      f.send({
        text:
          typeof sentences[sentenceIdx] === 'string'
            ? sentences[sentenceIdx]
            : sentences[sentenceIdx].text,
        idx: sentenceIdx,
      });
    })
  }
}


function startProcessingSentences() {
  for (let i = 0; i < forks.length; i++){
    processSentenceByIndex(i)
  }
}

setupForks().then(()=> {
  startProcessingSentences();
})