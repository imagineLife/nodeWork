const express = require('express');
const expressSession = require('express-session');
const sessionsRouter = require('./session-route-handler')
const { routes: { session }, cookie } = require('./constants')

// vars
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || cookie.secret;
const sessionObj = {
  maxAge: cookie.age,
  name: cookie.name,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
};
const app = express();

function startCallback() {
  console.log(`Server started on port ${PORT}`);  
}

// Middleware to parse request bodies
app.use(express.json());

// Configure cookie-session middleware
app.use(expressSession(sessionObj));

app.use(session.root, sessionsRouter);

// Start the server
app.listen(PORT, startCallback);
