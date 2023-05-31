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

// Endpoint to create a session
app.get('/make-a-session', (req, res) => {
  req.session.example = 'Hello, session!'; // Set session data
  res.send('Session created!');
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
