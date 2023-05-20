import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import pollingRouter from './polling/index.js'
import { setup } from './msgs/index.js'

const port = process.env.PORT || 3000;
const POLLING_PATH = '/poll'
const staticFrontend = express.static('frontend');

// get express ready to run
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(staticFrontend);
app.use(POLLING_PATH, pollingRouter);

setup()

// start the server
app.listen(port);
console.log(`listening on http://localhost:${port}`);
