const express = require('express');
const cookieSession = require('cookie-session');
const sessionsRouter = require('./session-route-handler')
const { routes: { session }, cookie } = require('./constants')

// vars
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || cookie.secret;
const sessionObj = {
  name: cookie.name,
  secret: SESSION_SECRET,
  maxAge: cookie.age
}
const app = express();

function startCallback() {
  console.log(`Server started on port ${PORT}`);  
}

// Middleware to parse request bodies
app.use(express.json());

// Configure cookie-session middleware
app.use(cookieSession(sessionObj));

app.use(session.root, sessionsRouter);

// Start the server
app.listen(PORT, startCallback);
