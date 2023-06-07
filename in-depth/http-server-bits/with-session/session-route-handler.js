const express = require('express');
const sessionsRouter = express.Router();

// read the session
sessionsRouter.get('/', (req, res) => {
  return res.json(req.session);
});

// 
sessionsRouter.get('/update/:randomString', (req, res) => {
  req.session.randomString = req.params.randomString
  return res.json(req?.session);
});

sessionsRouter.get('/keyVal/:myKey/:myVal', (req, res) => {
  req.session[`${req.params.myKey}`] = `${req.params.myVal}`;
  return res.json(req?.session);
});

sessionsRouter.get('/clear', (req, res) => {
  req.session = null;
  return res.json(req?.session)
});

module.exports = sessionsRouter;
