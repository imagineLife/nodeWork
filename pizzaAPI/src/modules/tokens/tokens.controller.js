function createTokensController(tokensService) {
  return {
    post(data, callback) {
      tokensService.post(data, callback);
    },
    get(data, callback) {
      tokensService.get(data, callback);
    },
    put(data, callback) {
      tokensService.put(data, callback);
    },
    delete(data, callback) {
      tokensService.delete(data, callback);
    }
  };
}

module.exports = createTokensController;
