const { usersById } = require('./byId');
const { userData } = require('./../userData')

function getUsers(request, reply) {
  reply.send(userData);
}

function postAUser(request, reply) {
  const { name } = request.body;
  const id = userData.length + 1;
  const newUser = { id, name };
  userData.push(newUser);
  reply.code(201).send(newUser);
}

module.exports.usersHandlers = (fastify, _, done) => {
  // Retrieve all users
  fastify
    .get('/', getUsers)
    .post('/', postAUser);

  // Retrieve a single user
  fastify.register(usersById, { prefix: '/:id' });

  done();
};
