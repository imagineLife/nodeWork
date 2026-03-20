const tokensRepo = require('./tokens.repo.fs');
const createTokensService = require('./tokens.service');
const createTokensController = require('./tokens.controller');
const createTokensRoute = require('./tokens.routes');

const tokensService = createTokensService(tokensRepo);
const tokensController = createTokensController(tokensService);
const tokensRouteHandler = createTokensRoute(tokensController);

module.exports = {
  tokensRouteHandler,
  tokensService
};
