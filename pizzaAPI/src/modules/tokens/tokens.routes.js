function createTokensRoute(tokensController) {
  return function tokensRoute(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) > -1) {
      tokensController[data.method](data, callback);
    } else {
      callback(405);
    }
  };
}

module.exports = createTokensRoute;
