const PROCESS_NAME = 'count-length';
process.on('message', (sentData) => {
  if (sentData?.kill === true) {
    console.log(`killing forked process ${PROCESS_NAME} on pid ${process.pid}`);
    process.exit();
  }

  // console.log(`${PROCESS_NAME} message! sentenceIdx ${sentData.idx}`); //pid: ${process.pid}

  process.send({
    sentenceIdx: sentData.idx,
    analysis: {
      stringLength: sentData.text.length,
    },
  });
});
