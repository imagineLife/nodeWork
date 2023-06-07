const express = require('express');
const sessionsRouter = express.Router();

const routes = {
  root: '/',
  updateWithRandom: '/update/:randomString',
  updateWithKeyVal: '/keyVal/:myKey/:myVal',
  clear: '/clear'
};
// read the session
sessionsRouter.get(routes.root, (req, res) => {
  return res.json(req.session);
});


sessionsRouter.get(routes.updateWithRandom, (req, res) => {
  req.session.randomString = req.params.randomString
  return res.json(req?.session);
});

sessionsRouter.get(routes.updateWithKeyVal, (req, res) => {
  req.session[`${req.params.myKey}`] = `${req.params.myVal}`;
  return res.json(req?.session);
});

sessionsRouter.get(routes.clear, (req, res) => {
  req.session = null;
  return res.json(req?.session)
});

module.exports = sessionsRouter;
