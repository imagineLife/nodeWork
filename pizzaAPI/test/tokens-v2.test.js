const test = require('node:test');
const assert = require('node:assert/strict');

const routeHandlers = require('../lib/handlers');
const { tokensRouteHandler, tokensService } = require('../src/modules/tokens');
const { createSandbox, invoke, makeRequest } = require('./helpers/sandbox');

test('v2 tokens route returns 405 for unsupported method', async () => {
  const res = await invoke(tokensRouteHandler, makeRequest('patch'));
  assert.equal(res.statusCode, 405);
});

test('v2 tokens route supports create/get/put/delete lifecycle', async () => {
  const sandbox = createSandbox();

  try {
    const email = 'tokens-v2@example.com';
    const passWord = 'secret-pass';

    const createUserRes = await invoke(
      routeHandlers.users,
      makeRequest('post', {
        firstName: 'Token',
        lastName: 'Module',
        email,
        address: '123 Main',
        passWord,
        tosAgreement: true
      })
    );
    assert.equal(createUserRes.statusCode, 200);

    const tokenCreateRes = await invoke(
      tokensRouteHandler,
      makeRequest('post', { email, passWord })
    );
    assert.equal(tokenCreateRes.statusCode, 200);
    assert.ok(tokenCreateRes.payload.tokenId);
    const tokenId = tokenCreateRes.payload.tokenId;

    const tokenGetRes = await invoke(
      tokensRouteHandler,
      makeRequest('get', {}, { id: tokenId })
    );
    assert.equal(tokenGetRes.statusCode, 200);
    assert.equal(tokenGetRes.payload.email, email);

    const tokenPutRes = await invoke(
      tokensRouteHandler,
      makeRequest('put', { id: tokenId, extend: true })
    );
    assert.equal(tokenPutRes.statusCode, 200);

    const verifyRes = await new Promise((resolve) => {
      tokensService.verifyTokenMatch(tokenId, email, (isValid) => resolve(isValid));
    });
    assert.equal(verifyRes, true);

    const tokenDeleteRes = await invoke(
      tokensRouteHandler,
      makeRequest('delete', {}, { id: tokenId })
    );
    assert.equal(tokenDeleteRes.statusCode, 200);
  } finally {
    sandbox.restore();
  }
});
