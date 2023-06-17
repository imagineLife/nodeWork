/*
  NOTE: 
    this started as a clone of "with-session", using the cookie-session middleware
    this is more about the logging tool "winston"
    https://github.com/winstonjs/winston
*/ 
const express = require('express');
const cookieSession = require('cookie-session');
const sessionsRouter = require('./session-route-handler')
const { routes: { session }, cookie } = require('./constants')
const { registerLogger } = require('./logger')


registerLogger()
const log = require('./logger').getLogger();

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
  log.info(`Server started on port ${PORT}`);
  // console.log(`server started on port ${PORT}`)
}

// Middleware to parse request bodies
app.use(express.json());

// Configure cookie-session middleware
app.use(cookieSession(sessionObj));

app.use(session.root, sessionsRouter);

// Start the server
app.listen(PORT, startCallback);
