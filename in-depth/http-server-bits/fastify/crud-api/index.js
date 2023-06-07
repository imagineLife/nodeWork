// Imports
const fastify = require('fastify');
const { usersHandlers } = require('./users')

const app = fastify();
const PORT = process.env.PORT || 3000

function listenCallback(err, address){
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
}

app.register(usersHandlers, { prefix: '/users' })

// Start the server
app.listen({ port: PORT }, listenCallback);
