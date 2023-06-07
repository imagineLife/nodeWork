// Import Fastify
const fastify = require('fastify')();

const PORT = process.env.PORT || 3000;

// Mock data for testing purposes
let users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

function getUsers(request, reply) {
  reply.send(users);
}

function getUserById(request, reply) {
  const { id } = request.params;
  const user = users.find((user) => user.id === parseInt(id));

  if (user) {
    reply.send(user);
  } else {
    reply.code(404).send({ error: 'User not found' });
  }
}

function postAUser(request, reply) {
  const { name } = request.body;
  const id = users.length + 1;
  const newUser = { id, name };
  users.push(newUser);
  reply.code(201).send(newUser);
}

function updateAUser(request, reply) {
  const { id } = request.params;
  const { name } = request.body;
  const user = users.find((user) => user.id === parseInt(id));

  if (user) {
    user.name = name;
    reply.send(user);
  } else {
    reply.code(404).send({ error: 'User not found' });
  }
}

function deleteAUser(request, reply) {
  const { id } = request.params;
  const index = users.findIndex((user) => user.id === parseInt(id));

  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    reply.send(deletedUser);
  } else {
    reply.code(404).send({ error: 'User not found' });
  }
}

function listenCallback(err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
}

module.exports.usersHandlers = (fastify, _, done) => {
  // Retrieve all users
  fastify
    .get('/', getUsers)
    .post('/', postAUser);

  // Retrieve a single user
  fastify
    .get('/:id', getUserById)
    .put('/:id', updateAUser)
    .delete('/:id', deleteAUser);

  done();
};
