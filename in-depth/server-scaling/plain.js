const e = require('express');
const app = e();
const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`plain-server is running on port ${port}`);
})

function rootHandler(req,res){
  // mock a waiting process;
  for(var x = 0; x < 2e6; x++){}
  res.send('server response here!')
}
app.get('/', rootHandler)