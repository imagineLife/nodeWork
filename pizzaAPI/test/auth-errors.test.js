const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const dataLib = require('../lib/data');
const routeHandlers = require('../lib/handlers');

function createSandbox() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pizza-api-auth-test-'));
  const dataRoot = path.join(tmpRoot, '.data');

  fs.mkdirSync(path.join(dataRoot, 'users'), { recursive: true });
  fs.mkdirSync(path.join(dataRoot, 'tokens'), { recursive: true });
  fs.mkdirSync(path.join(dataRoot, 'cart'), { recursive: true });
  fs.mkdirSync(path.join(dataRoot, 'menuItems'), { recursive: true });

  const oldDataBaseDir = dataLib.baseDir;
  dataLib.baseDir = `${dataRoot}${path.sep}`;

  return {
    restore() {
      dataLib.baseDir = oldDataBaseDir;
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  };
}

function invoke(handler, data) {
  return new Promise((resolve) => {
    handler(data, (statusCode, payload, contentType) => {
      resolve({ statusCode, payload, contentType });
    });
  });
}

function makeRequest(method, payload = {}, queryStrObj = {}, headers = {}) {
  return {
    method,
    payload,
    queryStrObj,
    headers,
    trimmedPath: ''
  };
}

test('users/token handlers cover common error branches', async () => {
  const sandbox = createSandbox();

  try {
    const email = 'case@example.com';

    const missingCreate = await invoke(routeHandlers.users, makeRequest('post', { email }));
    assert.equal(missingCreate.statusCode, 400);

    const createUser = await invoke(
      routeHandlers.users,
      makeRequest('post', {
        firstName: 'Case',
        lastName: 'User',
        email,
        address: '10 Main',
        passWord: 'secret',
        tosAgreement: true
      })
    );
    assert.equal(createUser.statusCode, 200);

    const duplicateUser = await invoke(
      routeHandlers.users,
      makeRequest('post', {
        firstName: 'Case',
        lastName: 'User',
        email,
        address: '10 Main',
        passWord: 'secret',
        tosAgreement: true
      })
    );
    assert.equal(duplicateUser.statusCode, 400);

    const missingTokenCreate = await invoke(routeHandlers.tokens, makeRequest('post', { email }));
    assert.equal(missingTokenCreate.statusCode, 400);

    const badUserToken = await invoke(routeHandlers.tokens, makeRequest('post', { email: 'nobody@example.com', passWord: 'secret' }));
    assert.equal(badUserToken.statusCode, 400);

    const tokenRes = await invoke(routeHandlers.tokens, makeRequest('post', { email, passWord: 'secret' }));
    assert.equal(tokenRes.statusCode, 200);
    const tokenId = tokenRes.payload.tokenId;

    const badTokenPassword = await invoke(routeHandlers.tokens, makeRequest('post', { email, passWord: 'wrong' }));
    assert.equal(badTokenPassword.statusCode, 400);

    const tokenGetBadId = await invoke(routeHandlers.tokens, makeRequest('get', {}, { id: 'short' }));
    assert.equal(tokenGetBadId.statusCode, 400);

    const tokenGetNotFound = await invoke(routeHandlers.tokens, makeRequest('get', {}, { id: '1234567890123456789' }));
    assert.equal(tokenGetNotFound.statusCode, 404);

    const tokenPutMissing = await invoke(routeHandlers.tokens, makeRequest('put', { id: tokenId }));
    assert.equal(tokenPutMissing.statusCode, 400);

    const tokenPutNotFound = await invoke(
      routeHandlers.tokens,
      makeRequest('put', { id: '1234567890123456789', extend: true })
    );
    assert.equal(tokenPutNotFound.statusCode, 400);

    const expiredTokenId = 'expiredtokenid12345';
    fs.writeFileSync(
      path.join(dataLib.baseDir, 'tokens', `${expiredTokenId}.json`),
      JSON.stringify({ email, tokenId: expiredTokenId, expires: Date.now() - 1000 }),
      'utf8'
    );
    const tokenPutExpired = await invoke(
      routeHandlers.tokens,
      makeRequest('put', { id: expiredTokenId, extend: true })
    );
    assert.equal(tokenPutExpired.statusCode, 400);

    const tokenDeleteMissing = await invoke(routeHandlers.tokens, makeRequest('delete', {}, { id: '' }));
    assert.equal(tokenDeleteMissing.statusCode, 400);

    const tokenDeleteNotFound = await invoke(routeHandlers.tokens, makeRequest('delete', {}, { id: '1234567890123456789' }));
    assert.equal(tokenDeleteNotFound.statusCode, 400);

    const usersGetMissingEmail = await invoke(routeHandlers.users, makeRequest('get', {}, {}, { token: tokenId }));
    assert.equal(usersGetMissingEmail.statusCode, 400);

    const usersGetBadToken = await invoke(routeHandlers.users, makeRequest('get', {}, { email }, { token: 'bad' }));
    assert.equal(usersGetBadToken.statusCode, 403);

    const usersPutMissingEmail = await invoke(routeHandlers.users, makeRequest('put', { firstName: 'x' }));
    assert.equal(usersPutMissingEmail.statusCode, 400);

    const usersPutMissingFields = await invoke(routeHandlers.users, makeRequest('put', {}, { email }, { token: tokenId }));
    assert.equal(usersPutMissingFields.statusCode, 400);

    const usersPutBadToken = await invoke(routeHandlers.users, makeRequest('put', { firstName: 'x' }, { email }, { token: 'bad' }));
    assert.equal(usersPutBadToken.statusCode, 403);

    const usersDeleteMissingEmail = await invoke(routeHandlers.users, makeRequest('delete', {}, {}, { token: tokenId }));
    assert.equal(usersDeleteMissingEmail.statusCode, 400);

    const usersDeleteBadToken = await invoke(routeHandlers.users, makeRequest('delete', {}, { email }, { token: 'bad' }));
    assert.equal(usersDeleteBadToken.statusCode, 403);

    const usersDeleteOk = await invoke(routeHandlers.users, makeRequest('delete', {}, { email }, { token: tokenId }));
    assert.equal(usersDeleteOk.statusCode, 200);

    const usersDeleteMissingUser = await invoke(routeHandlers.users, makeRequest('delete', {}, { email }, { token: tokenId }));
    assert.equal(usersDeleteMissingUser.statusCode, 400);
  } finally {
    sandbox.restore();
  }
});

test('users/tokens/menu dispatchers return 405 on unsupported methods', async () => {
  const usersMethod = await invoke(routeHandlers.users, makeRequest('patch'));
  assert.equal(usersMethod.statusCode, 405);

  const tokensMethod = await invoke(routeHandlers.tokens, makeRequest('patch'));
  assert.equal(tokensMethod.statusCode, 405);

  const menuMethod = await invoke(routeHandlers.menuItems, makeRequest('post'));
  assert.equal(menuMethod.statusCode, 405);
});
