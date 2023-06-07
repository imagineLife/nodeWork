const express = require('express');
const cookieSession = require('cookie-session');
const sessionsRouter = require('./session-route-handler')
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

function startCallback() {
  console.log(`Server started on port ${PORT}`);  
}

// Middleware to parse request bodies
app.use(express.json());

// Configure cookie-session middleware
app.use(cookieSession(sessionObj));

app.use('/mySession', sessionsRouter);

// Start the server
app.listen(PORT, startCallback);
