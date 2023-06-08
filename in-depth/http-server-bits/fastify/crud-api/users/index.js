const { usersById } = require('./byId');
const { userData } = require('./../userData')

function getUsers(req, res) {
  res.send(userData);
}

function postAUser(req, res) {
  const { name } = req.body;
  const id = userData.length + 1;
  const newUser = { id, name };
  userData.push(newUser);
  res.code(201).send(newUser);
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
