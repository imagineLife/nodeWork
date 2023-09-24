/*

*/ 
console.time('shebang')
const { exec } = require('child_process');
const sentences = require('./sentences.js');
const waysToAnalyze = [
  {
    file: './simple-analysis/logastring.js',
    name: 'logAString',
  },
  {
    file: './simple-analysis/countLength.js',
    name: 'countLength',
  },
];

let sentencesDone = 0;
let analysisDone = 0;
const HOW_MANY_PROCESSES = 4;

console.log(`Processing ${sentences.length} sentences with ${HOW_MANY_PROCESSES} processes and ${waysToAnalyze.length} analysis per sentence`)



// 
// 
// 
function checkAnalysisDone() {
  let isDone = sentencesDone === sentences.length &&
    analysisDone !== waysToAnalyze.length - 1;
  // console.log('checkAnalysisDone', isDone);
  if (isDone) {
    analysisDone = analysisDone + 1;
    sentencesDone = 0;
    startProcessingInput({ maxProcesses: HOW_MANY_PROCESSES });
  }
}



// 
// 
// 
function checkDoneAndFinish() {
  if (sentencesDone === sentences.length) {
    // console.log('sentences');
    // console.log(sentences);
    console.timeEnd('shebang');
  }
}





// 
// 
// 
function handleProcessResponse(sentenceIdx) { 
  return function execHandler(err, stdout, stderr){
    if (err) {
      console.log('err', err);
    }
    if (stderr) {
      console.log('subprocess stderr: ', stderr.toString());
    }

    if (stdout) {
      // prep resulting analytics object per sentence
      if (analysisDone === 0) {
        let originalSentenceText = (' ' + sentences[sentenceIdx]).slice(1);
        sentences[sentenceIdx] = {};
        sentences[sentenceIdx].text = originalSentenceText;
      }

      sentences[sentenceIdx][`${waysToAnalyze[analysisDone].name}`] = JSON.parse(stdout);
      sentencesDone++;
      // console.log(`DONE with idx ${sentenceIdx}`);

      if (sentenceIdx + HOW_MANY_PROCESSES < sentences.length + HOW_MANY_PROCESSES - 1) {
        processSentenceByIndex(sentenceIdx + HOW_MANY_PROCESSES);
      }
      checkAnalysisDone();
      checkDoneAndFinish();
    }
  }
} 





// 
// 
// 
function processSentenceByIndex(sentenceIdx) {
  if (sentenceIdx < sentences.length) {
    exec(
      `${process.execPath} ${waysToAnalyze[analysisDone].file}`,
      {
        env: {
          idx: sentenceIdx,
          text:
            typeof sentences[sentenceIdx] === 'string'
              ? sentences[sentenceIdx]
              : sentences[sentenceIdx].text,
        },
      },
      handleProcessResponse(sentenceIdx)
    );
  }
}





// 
// 
// 
function startProcessingInput({
  maxProcesses,
}) {
  for (let i = 0; i < maxProcesses; i++){
    // console.log('// - - - - - //')
    // console.log('startProcessingInput loop! idx',i)
    // console.log('// - - - - - //');
    processSentenceByIndex(i)
  }
}

startProcessingInput({ maxProcesses: HOW_MANY_PROCESSES });