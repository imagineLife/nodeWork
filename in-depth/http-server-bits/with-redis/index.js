const express = require('express');
const redis = require('redis');

const app = express();
const api_port = process.env.PORT || 3000;
const redis_port = process.env.REDIS_PORT || 6379;
const redis_host = process.env.REDIS_HOST || 'redisbox';

let redisClient;
async function setupRedis() {
  const redisHost = process.env.REDIS_HOSTNAME || '';

  // Create a Redis client
  redisClient = redis.createClient({
    socket: {
      port: redis_port,
      host: redis_host,
    },
  });
  await redisClient.connect(() => {
    console.log('redis client connected!');
  });
}

function setupExpress() {
  app.use(express.json());

  // Create a new item
  app.post('/items', async (req, res) => {
    const { id, name } = req.body;
    console.log({
      id,
      name,
    });

    const newItem = { id, name };

    let reply = await redisClient.HSET('items', id, JSON.stringify(newItem));
    console.log('reply');
    console.log(reply);

    res.status(201).json(newItem);
  });

  // Get all items
  app.get('/items', (req, res) => {
    console.log('get to items!');

    redisClient.HGETALL('items', (err, items) => {
      if (err) {
        res.status(500).json({ error: 'Unable to fetch items' });
      } else {
        const itemList = Object.values(items).map((item) => JSON.parse(item));
        res.status(200).json(itemList);
      }
    });
  });

  // Get an item by ID
  app.get('/items/:id', async (req, res) => {
    const { id } = req.params;

    let res = await redisClient.HGET('items', id);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.status(200).json(JSON.parse(item));
    }
  });

  // Update an item by ID
  app.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const updatedItem = req.body;

    const reply = await redisClient.HSET('items', id, JSON.stringify(updatedItem));
    res.status(200).json(updatedItem);
  });

  // Delete an item by ID
  app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;

    let deleted = await redisClient.HDEL('items', id);
    console.log('deleted');
    console.log(deleted);

    res.status(204).end();
  });

  const expressServer = app.listen(api_port, () => {
    console.log(`Server is running on port ${api_port}`);
  });

  function killEmAll(signal) {
    console.log(`registering signal handling for ${signal}`);

    process.on(signal, async () => {
      console.log(`${signal} received: closing HTTP server`);
      expressServer.close(() => {
        console.log('express server closed');
      });
    });
  }
  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(killEmAll);
}

async function runIt() {
  await setupRedis();
  setupExpress();
}
runIt();
