import Router from 'express';
import { msgArr, get  } from './../msgs/index.js'
const pollingRouter = new Router();

function getPollHandler(req,res) {
  res.json({
    msg: get(),
  });
}

function postPollHandler(req, res) {
  const { user, text } = req.body;
  
  msgArr.push({
    user,
    text,
    time: Date.now(),
  });
  console.log('msgArr after push')
  console.log(msgArr)
  
  res.json({ status: 'ok' });
}

pollingRouter.get('/', getPollHandler).post('/', postPollHandler);

export default pollingRouter;
