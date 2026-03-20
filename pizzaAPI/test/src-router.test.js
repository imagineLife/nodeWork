const test = require('node:test');
const assert = require('node:assert/strict');

const createLegacyRouter = require('../src/app/router');

function makeHandlers() {
  const fn = () => {};
  return {
    doIndex: fn,
    users: fn,
    tokens: fn,
    menuItems: fn,
    cart: fn,
    charge: fn,
    accountCreate: fn,
    accountEdit: fn,
    menu: fn,
    cartView: fn,
    checkout: fn,
    sessionCreate: fn,
    sessionDeleted: fn,
    favicon: fn,
    public: fn
  };
}

test('createLegacyRouter maps all legacy routes', () => {
  const handlers = makeHandlers();
  const router = createLegacyRouter(handlers);

  assert.equal(router[''], handlers.doIndex);
  assert.equal(router['api/users'], handlers.users);
  assert.equal(router['api/tokens'], handlers.tokens);
  assert.equal(router['api/menuItems'], handlers.menuItems);
  assert.equal(router['api/cart'], handlers.cart);
  assert.equal(router['api/charge'], handlers.charge);
  assert.equal(router['account/create'], handlers.accountCreate);
  assert.equal(router['account/edit'], handlers.accountEdit);
  assert.equal(router['menu'], handlers.menu);
  assert.equal(router['cart'], handlers.cartView);
  assert.equal(router['checkout'], handlers.checkout);
  assert.equal(router['session/create'], handlers.sessionCreate);
  assert.equal(router['session/deleted'], handlers.sessionDeleted);
  assert.equal(router['favicon.ico'], handlers.favicon);
  assert.equal(router['public'], handlers.public);
});

test('createLegacyRouter notFound route returns 404', async () => {
  const router = createLegacyRouter(makeHandlers());

  const result = await new Promise((resolve) => {
    router.notFound({}, (statusCode) => resolve(statusCode));
  });

  assert.equal(result, 404);
});

test('createLegacyRouter requires handlers object', () => {
  assert.throws(() => createLegacyRouter(), /handlers object is required/);
  assert.throws(() => createLegacyRouter(null), /handlers object is required/);
});
