console.time('shebang')
const { exec } = require('child_process');
const waysToAnalyze = [
  {
    file: './logastring.js',
    name: 'logAString',
  },
  {
    file: './countLength.js',
    name: 'countLength'
  },
];

let sentences = [
  'Through a crucible for the ages America has been tested anew and America has risen to the challenge.',
  'Today, we celebrate the triumph not of a candidate, but of a cause, the cause of democracy.',
  'The will of the people has been heard and the will of the people has been heeded.',
  'We have learned again that democracy is precious.',
  'Democracy is fragile.',
  'And at this hour, my friends, democracy has prevailed.',
  'So now, on this hallowed ground where just days ago violence sought to shake this Capitol’s very foundation, we come together as one nation, under God, indivisible, to carry out the peaceful transfer of power as we have for more than two centuries.',
  'We look ahead in our uniquely American way – restless, bold, optimistic – and set our sights on the nation we know we can be and we must be.',
  'I thank my predecessors of both parties for their presence here.',
  'I thank them from the bottom of my heart.',
  'Democracy is fragile.',
  'And at this hour, my friends, democracy has prevailed.',
  'So now, on this hallowed ground where just days ago violence sought to shake this Capitol’s very foundation, we come together as one nation, under God, indivisible, to carry out the peaceful transfer of power as we have for more than two centuries.',
  'We look ahead in our uniquely American way – restless, bold, optimistic – and set our sights on the nation we know we can be and we must be.',
  'I thank my predecessors of both parties for their presence here.',
  'I thank them from the bottom of my heart.',
  'The will of the people has been heard and the will of the people has been heeded.',
  'We have learned again that democracy is precious.',
  'Democracy is fragile.',
  'And at this hour, my friends, democracy has prevailed.',
  'So now, on this hallowed ground where just days ago violence sought to shake this Capitol’s very foundation, we come together as one nation, under God, indivisible, to carry out the peaceful transfer of power as we have for more than two centuries.',
  'We look ahead in our uniquely American way – restless, bold, optimistic – and set our sights on the nation we know we can be and we must be.',
  'I thank my predecessors of both parties for their presence here.',
  'I thank them from the bottom of my heart.',
  'Democracy is fragile.',
  'And at this hour, my friends, democracy has prevailed.',
  'So now, on this hallowed ground where just days ago violence sought to shake this Capitol’s very foundation, we come together as one nation, under God, indivisible, to carry out the peaceful transfer of power as we have for more than two centuries.',
  'We look ahead in our uniquely American way – restless, bold, optimistic – and set our sights on the nation we know we can be and we must be.',
  'I thank my predecessors of both parties for their presence here.',
  'I thank them from the bottom of my heart.',
  'Through a crucible for the ages America has been tested anew and America has risen to the challenge.',
  'Today, we celebrate the triumph not of a candidate, but of a cause, the cause of democracy.',
  'The will of the people has been heard and the will of the people has been heeded.',
  'We have learned again that democracy is precious.',
  'Democracy is fragile.',
  'And at this hour, my friends, democracy has prevailed.',
  'So now, on this hallowed ground where just days ago violence sought to shake this Capitol’s very foundation, we come together as one nation, under God, indivisible, to carry out the peaceful transfer of power as we have for more than two centuries.',
  'We look ahead in our uniquely American way – restless, bold, optimistic – and set our sights on the nation we know we can be and we must be.',
  'I thank my predecessors of both parties for their presence here.',
  'I thank them from the bottom of my heart.',
  'Democracy is fragile.',
  'And at this hour, my friends, democracy has prevailed.',
  'So now, on this hallowed ground where just days ago violence sought to shake this Capitol’s very foundation, we come together as one nation, under God, indivisible, to carry out the peaceful transfer of power as we have for more than two centuries.',
  'We look ahead in our uniquely American way – restless, bold, optimistic – and set our sights on the nation we know we can be and we must be.',
  'I thank my predecessors of both parties for their presence here.',
  'I thank them from the bottom of my heart.',
  'The will of the people has been heard and the will of the people has been heeded.',
  'We have learned again that democracy is precious.',
  'Democracy is fragile.',
  'And at this hour, my friends, democracy has prevailed.',
  'So now, on this hallowed ground where just days ago violence sought to shake this Capitol’s very foundation, we come together as one nation, under God, indivisible, to carry out the peaceful transfer of power as we have for more than two centuries.',
  'We look ahead in our uniquely American way – restless, bold, optimistic – and set our sights on the nation we know we can be and we must be.',
  'I thank my predecessors of both parties for their presence here.',
  'I thank them from the bottom of my heart.',
  'Democracy is fragile.',
  'And at this hour, my friends, democracy has prevailed.',
  'So now, on this hallowed ground where just days ago violence sought to shake this Capitol’s very foundation, we come together as one nation, under God, indivisible, to carry out the peaceful transfer of power as we have for more than two centuries.',
  'We look ahead in our uniquely American way – restless, bold, optimistic – and set our sights on the nation we know we can be and we must be.',
  'I thank my predecessors of both parties for their presence here.',
  'I thank them from the bottom of my heart.',
];
let doneCount = 0;
let analysisIndex = 0;
const HOW_MANY_PROCESSES = 16;




// 
// 
// 
function checkAnalysisDone() {
  let isDone = doneCount === sentences.length &&
    analysisIndex !== waysToAnalyze.length - 1;
  // console.log('checkAnalysisDone', isDone);
  if (isDone) {
    analysisIndex = analysisIndex + 1;
    doneCount = 0;
    startProcessingInput({ maxProcesses: HOW_MANY_PROCESSES });
  }
}



// 
// 
// 
function checkDoneAndFinish() {
  if (doneCount === sentences.length) {
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
      if (analysisIndex === 0) {
        let originalSentenceText = (' ' + sentences[sentenceIdx]).slice(1);
        sentences[sentenceIdx] = {};
        sentences[sentenceIdx].text = originalSentenceText;
      }

      sentences[sentenceIdx][`${waysToAnalyze[analysisIndex].name}`] = JSON.parse(stdout);
      doneCount++;
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
      `${process.execPath} ${waysToAnalyze[analysisIndex].file}`,
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