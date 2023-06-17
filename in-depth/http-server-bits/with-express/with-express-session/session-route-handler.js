const express = require('express');
const sessionsRouter = express.Router();
const {routes: { session }} = require('./constants')

// read the session
sessionsRouter.get('/', (req, res) => {
  return res.json(req.session);
});


sessionsRouter.get(session.updateWithRandom, (req, res) => {
  req.session.randomString = req.params.randomString
  return res.json(req?.session);
});

sessionsRouter.get(session.updateWithKeyVal, (req, res) => {
  req.session[`${req.params.myKey}`] = `${req.params.myVal}`;
  return res.json(req?.session);
});

sessionsRouter.get(session.removeKeyVal, (req, res) => {
  delete req.session[`${req.params.myKey}`];
  return res.json(req?.session);
});

sessionsRouter.get(session.clear, (req, res) => {
  req.session.destroy(e => {
    if (e) throw new Error(e);
    return res.json(req?.session);
  })
});

module.exports = sessionsRouter;
