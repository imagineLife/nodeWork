const test = require('node:test');
const assert = require('node:assert/strict');

const routeHandlers = require('../../lib/handlers');
const charge = require('../../lib/handlers/api/charge');
const { createSandbox, invoke, makeRequest } = require('../helpers/sandbox');

async function createUserAndToken(email, passWord = 'secret-pass') {
  const createUserRes = await invoke(
    routeHandlers.users,
    makeRequest('post', {
      firstName: 'Case',
      lastName: 'Contract',
      email,
      address: '101 Main St',
      passWord,
      tosAgreement: true
    })
  );
  assert.equal(createUserRes.statusCode, 200);

  const createTokenRes = await invoke(
    routeHandlers.tokens,
    makeRequest('post', {
      email,
      passWord
    })
  );
  assert.equal(createTokenRes.statusCode, 200);
  assert.ok(createTokenRes.payload.tokenId);

  return createTokenRes.payload.tokenId;
}

test('users contract: user creation succeeds and reads require token', async () => {
  const sandbox = createSandbox();

  try {
    const email = 'users-contract@example.com';
    const tokenId = await createUserAndToken(email);

    const getWithoutToken = await invoke(
      routeHandlers.users,
      makeRequest('get', {}, { email })
    );
    assert.equal(getWithoutToken.statusCode, 403);

    const getWithToken = await invoke(
      routeHandlers.users,
      makeRequest('get', {}, { email }, { token: tokenId })
    );
    assert.equal(getWithToken.statusCode, 200);
    assert.equal(getWithToken.payload.email, email);
    assert.equal(getWithToken.payload.hashedPW, undefined);
  } finally {
    sandbox.restore();
  }
});

test('tokens contract: token creation succeeds and bad password fails', async () => {
  const sandbox = createSandbox();

  try {
    const email = 'tokens-contract@example.com';
    const passWord = 'secret-pass';

    const createUserRes = await invoke(
      routeHandlers.users,
      makeRequest('post', {
        firstName: 'Token',
        lastName: 'User',
        email,
        address: '102 Main St',
        passWord,
        tosAgreement: true
      })
    );
    assert.equal(createUserRes.statusCode, 200);

    const createTokenRes = await invoke(
      routeHandlers.tokens,
      makeRequest('post', { email, passWord })
    );
    assert.equal(createTokenRes.statusCode, 200);
    assert.equal(createTokenRes.payload.email, email);
    assert.ok(createTokenRes.payload.tokenId);

    const badPasswordRes = await invoke(
      routeHandlers.tokens,
      makeRequest('post', { email, passWord: 'wrong-pass' })
    );
    assert.equal(badPasswordRes.statusCode, 400);
  } finally {
    sandbox.restore();
  }
});

test('menuItems contract: authorized reads succeed and invalid token fails', async () => {
  const sandbox = createSandbox();

  try {
    const email = 'menu-contract@example.com';
    const tokenId = await createUserAndToken(email);

    const menuSuccessRes = await invoke(
      routeHandlers.menuItems,
      makeRequest('get', {}, { email }, { token: tokenId })
    );
    assert.equal(menuSuccessRes.statusCode, 200);
    assert.ok(Array.isArray(menuSuccessRes.payload.MenuItems));
    assert.ok(menuSuccessRes.payload.MenuItems.length > 0);

    const menuBadTokenRes = await invoke(
      routeHandlers.menuItems,
      makeRequest('get', {}, { email }, { token: 'not-a-real-token' })
    );
    assert.equal(menuBadTokenRes.statusCode, 403);
  } finally {
    sandbox.restore();
  }
});

test('cart contract: cart creation succeeds and unauthorized reads fail', async () => {
  const sandbox = createSandbox();

  try {
    const email = 'cart-contract@example.com';
    const tokenId = await createUserAndToken(email);

    const cartCreateRes = await invoke(
      routeHandlers.cart,
      makeRequest(
        'post',
        { email, cart: [{ itemID: 1, count: 1, price: 10 }] },
        {},
        { token: tokenId }
      )
    );
    assert.equal(cartCreateRes.statusCode, 200);

    const cartGetBadToken = await invoke(
      routeHandlers.cart,
      makeRequest('get', {}, { email }, { token: 'bad-token' })
    );
    assert.equal(cartGetBadToken.statusCode, 403);
  } finally {
    sandbox.restore();
  }
});

test('charge contract: missing token fails and authenticated request can succeed', async () => {
  const sandbox = createSandbox();
  const originalProceedWithStripeUser = charge.proceedWithStripeUser;

  try {
    const email = 'charge-contract@example.com';
    const tokenId = await createUserAndToken(email);

    const cartCreateRes = await invoke(
      routeHandlers.cart,
      makeRequest(
        'post',
        { email, cart: [{ itemID: 1, count: 2, price: 10 }] },
        {},
        { token: tokenId }
      )
    );
    assert.equal(cartCreateRes.statusCode, 200);

    const missingTokenRes = await invoke(
      routeHandlers.charge,
      makeRequest('post', { email })
    );
    assert.equal(missingTokenRes.statusCode, 400);

    charge.proceedWithStripeUser = (_customer, _stripeData, _stripeRequestData, reqContext) => {
      reqContext.callback(200, { Success: 'email sent! :) ' });
    };

    const chargeSuccessRes = await invoke(
      routeHandlers.charge,
      makeRequest('post', { email, stripeID: 'cus_contract' }, {}, { token: tokenId })
    );
    assert.equal(chargeSuccessRes.statusCode, 200);
    assert.equal(chargeSuccessRes.payload.Success, 'email sent! :) ');
  } finally {
    charge.proceedWithStripeUser = originalProceedWithStripeUser;
    sandbox.restore();
  }
});
