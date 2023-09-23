const PROCESS_NAME = 'count-length';
process.on('message', (sentData) => {
  if (sentData?.kill === true) {
    console.log(`killing forked process ${PROCESS_NAME} on pid ${process.pid}`);
    process.exit();
  }
  console.log('child-process message!');

  console.log('countLength-fork process pid', pid);

  const jsRes = isPrime(number, pid, startTime);
  process.send({ ...jsRes, pid: process.pid });
});
