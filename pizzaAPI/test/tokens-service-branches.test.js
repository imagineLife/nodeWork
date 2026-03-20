const test = require('node:test');
const assert = require('node:assert/strict');

const createTokensService = require('../src/modules/tokens/tokens.service');
const dataLib = require('../lib/data');
const helpers = require('../lib/helpers');

const VALID_TOKEN_ID = '1234567890123456789';

function invokeServiceMethod(service, method, data) {
  return new Promise((resolve) => {
    service[method](data, (statusCode, payload, contentType) => {
      resolve({ statusCode, payload, contentType });
    });
  });
}

test('tokens.service post: missing email or password returns 400', async () => {
  const service = createTokensService({});

  const res = await invokeServiceMethod(service, 'post', { payload: { email: '', passWord: '' } });
  assert.equal(res.statusCode, 400);
});

test('tokens.service post: missing user returns 400', async () => {
  const originalRead = dataLib.read;
  const service = createTokensService({
    create: () => {}
  });

  try {
    dataLib.read = (_dir, _name, cb) => cb(new Error('missing-user'));

    const res = await invokeServiceMethod(service, 'post', {
      payload: { email: 'x@example.com', passWord: 'secret' }
    });
    assert.equal(res.statusCode, 400);
  } finally {
    dataLib.read = originalRead;
  }
});

test('tokens.service post: password mismatch returns 400', async () => {
  const originalRead = dataLib.read;
  const originalHash = helpers.hash;
  const service = createTokensService({
    create: () => {}
  });

  try {
    dataLib.read = (_dir, _name, cb) => cb(false, { hashedPW: 'stored-hash' });
    helpers.hash = () => 'wrong-hash';

    const res = await invokeServiceMethod(service, 'post', {
      payload: { email: 'x@example.com', passWord: 'secret' }
    });
    assert.equal(res.statusCode, 400);
  } finally {
    dataLib.read = originalRead;
    helpers.hash = originalHash;
  }
});

test('tokens.service post: repo create failure returns 500', async () => {
  const originalRead = dataLib.read;
  const originalHash = helpers.hash;
  const originalCreateRandomString = helpers.createRandomString;
  const service = createTokensService({
    create: (_id, _obj, cb) => cb('create-failed')
  });

  try {
    dataLib.read = (_dir, _name, cb) => cb(false, { hashedPW: 'good-hash', stripeID: null });
    helpers.hash = () => 'good-hash';
    helpers.createRandomString = () => VALID_TOKEN_ID;

    const res = await invokeServiceMethod(service, 'post', {
      payload: { email: 'x@example.com', passWord: 'secret' }
    });
    assert.equal(res.statusCode, 500);
  } finally {
    dataLib.read = originalRead;
    helpers.hash = originalHash;
    helpers.createRandomString = originalCreateRandomString;
  }
});

test('tokens.service get: invalid id returns 400', async () => {
  const service = createTokensService({});

  const res = await invokeServiceMethod(service, 'get', { queryStrObj: { id: 'short' } });
  assert.equal(res.statusCode, 400);
});

test('tokens.service get: read error returns 404', async () => {
  const service = createTokensService({
    read: (_id, cb) => cb(new Error('missing'))
  });

  const res = await invokeServiceMethod(service, 'get', {
    queryStrObj: { id: VALID_TOKEN_ID }
  });
  assert.equal(res.statusCode, 404);
});

test('tokens.service put: invalid payload returns 400', async () => {
  const service = createTokensService({});

  const res = await invokeServiceMethod(service, 'put', {
    payload: { id: 'short', extend: false }
  });
  assert.equal(res.statusCode, 400);
});

test('tokens.service put: token missing returns 400', async () => {
  const service = createTokensService({
    read: (_id, cb) => cb(new Error('missing'))
  });

  const res = await invokeServiceMethod(service, 'put', {
    payload: { id: VALID_TOKEN_ID, extend: true }
  });
  assert.equal(res.statusCode, 400);
});

test('tokens.service put: expired token returns 400', async () => {
  const service = createTokensService({
    read: (_id, cb) => cb(false, { expires: Date.now() - 1000 })
  });

  const res = await invokeServiceMethod(service, 'put', {
    payload: { id: VALID_TOKEN_ID, extend: true }
  });
  assert.equal(res.statusCode, 400);
});

test('tokens.service put: update failure returns 500', async () => {
  const service = createTokensService({
    read: (_id, cb) => cb(false, { expires: Date.now() + 1000 }),
    update: (_id, _obj, cb) => cb('update-failed')
  });

  const res = await invokeServiceMethod(service, 'put', {
    payload: { id: VALID_TOKEN_ID, extend: true }
  });
  assert.equal(res.statusCode, 500);
});

test('tokens.service delete: invalid id returns 400', async () => {
  const service = createTokensService({});

  const res = await invokeServiceMethod(service, 'delete', {
    queryStrObj: { id: 'short' }
  });
  assert.equal(res.statusCode, 400);
});

test('tokens.service delete: token missing returns 400', async () => {
  const service = createTokensService({
    read: (_id, cb) => cb(new Error('missing'))
  });

  const res = await invokeServiceMethod(service, 'delete', {
    queryStrObj: { id: VALID_TOKEN_ID }
  });
  assert.equal(res.statusCode, 400);
});

test('tokens.service delete: remove failure returns 500', async () => {
  const service = createTokensService({
    read: (_id, cb) => cb(false, { id: VALID_TOKEN_ID }),
    remove: (_id, cb) => cb('remove-failed')
  });

  const res = await invokeServiceMethod(service, 'delete', {
    queryStrObj: { id: VALID_TOKEN_ID }
  });
  assert.equal(res.statusCode, 500);
});

test('tokens.service verifyTokenMatch: read error returns false', async () => {
  const service = createTokensService({
    read: (_id, cb) => cb(new Error('missing'))
  });

  const result = await new Promise((resolve) => {
    service.verifyTokenMatch(VALID_TOKEN_ID, 'x@example.com', (ok) => resolve(ok));
  });

  assert.equal(result, false);
});

test('tokens.service verifyTokenMatch: non-matching token returns false', async () => {
  const service = createTokensService({
    read: (_id, cb) => cb(false, {
      email: 'different@example.com',
      expires: Date.now() + 1000
    })
  });

  const result = await new Promise((resolve) => {
    service.verifyTokenMatch(VALID_TOKEN_ID, 'x@example.com', (ok) => resolve(ok));
  });

  assert.equal(result, false);
});
