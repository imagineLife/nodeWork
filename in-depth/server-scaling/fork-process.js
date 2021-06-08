process.on("message", ({number, pid, startTime}) => {
  // mock a waiting process;
  for(var x = 0; x < 2e8; x++){}
  process.send("message");
  process.exit()
})