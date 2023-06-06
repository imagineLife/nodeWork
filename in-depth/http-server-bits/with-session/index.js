const express = require('express');
const cookieSession = require('cookie-session');
const PORT = process.env.PORT || 3000;
const SESSION_NAME = 'test-session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'generic-secret';
const SESSION_AGE = 24 * 60 * 60 * 1000; // 1 day
const sessionObj = {
  name: SESSION_NAME,
  secret: SESSION_SECRET,
  maxAge: SESSION_AGE
}
const app = express();

// Middleware to parse request bodies
app.use(express.json());

// Configure cookie-session middleware
app.use(cookieSession(sessionObj));

// Endpoint to create the session
app.get('/make-a-session', (req, res) => {
  return res.json(req.session);
});

app.get('/read-the-session', (req, res) => {
  return res.json(req.session)
});

app.get('/update-session/:randomString', (req, res) => {
  req.session.randomString = req.params.randomString
  return res.json(req?.session);
});

app.get('/keyVal/:myKey/:myVal', (req, res) => {
  console.log('req.params.myKey')
  console.log(req.params.myKey)
  
  req.session[`${req.params.myKey}`] = `${req.params.myVal}`;
  return res.json(req?.session);
});

app.get('/clear-session', (req, res) => {
  req.session = null;
  return res.json(req?.session)
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
