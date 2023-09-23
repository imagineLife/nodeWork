/*

*/ 
console.time('shebang')
const { execFile } = require('child_process');
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
let sentencesDone = 0;
let analysisDone = 0;
const HOW_MANY_PROCESSES = 8;

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
    console.log(sentences[0])
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
    execFile(
      process.execPath,
      [`${waysToAnalyze[analysisDone].file}`],
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