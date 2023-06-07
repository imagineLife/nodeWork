const { userData } = require('./../../userData');

const userNotFound = { error: "User not found" };

function getUserById(request, reply) {
  const { id } = request.params;
  const user = userData.find((user) => user.id === parseInt(id));

  if (user) {
    reply.send(user);
  } else {
    reply.code(404).send(userNotFound);
  }
}

function updateAUser(request, reply) {
  const { id } = request.params;
  const { name } = request.body;
  const user = userData.find((user) => user.id === parseInt(id));

  if (!user) {
    return reply.code(404).send(userNotFound);
  }

  user.name = name;
  reply.send(user);
}

function deleteAUser(request, reply) {
  const { id } = request.params;
  const foundUserIndex = userData.findIndex((user) => user.id === parseInt(id));

  if (foundUserIndex == -1) {
    return reply.code(404).send(userNotFound);
  }

  const deleted = userData.splice(foundUserIndex, 1);
  reply.send({ deleted });
}

module.exports.usersById = (fastify, _, done) => {
  // Retrieve a single user
  fastify.get('/', getUserById).put('/', updateAUser).delete('/', deleteAUser);

  done();
};
