const test = require('node:test');
const assert = require('node:assert/strict');

const charge = require('../lib/handlers/api/charge');
const doMail = require('../lib/handlers/api/mail');
const helpers = require('../lib/helpers');
const doTokens = require('../lib/handlers/api/tokens');
const doUsers = require('../lib/handlers/api/users');
const dataLib = require('../lib/data');
const logsLib = require('../lib/logs');

function waitForTick() {
  return new Promise((resolve) => setImmediate(resolve));
}

test('mail.send builds request options and resolves response', async () => {
  const originalRequest = helpers.request;
  const originalHost = process.env.MAILGUN_API_HOST;
  const originalDomain = process.env.MAILGUN_API_DOMAIN;
  const originalKey = process.env.MAILGUN_API_KEY;

  try {
    process.env.MAILGUN_API_HOST = 'api.mailgun.net';
    process.env.MAILGUN_API_DOMAIN = 'sandbox.example.org';
    process.env.MAILGUN_API_KEY = 'abc123';

    let captured;
    helpers.request = async (opts, body) => {
      captured = { opts, body };
      return { id: 'queued' };
    };

    const res = await doMail.send({
      from: 'from@example.com',
      to: 'to@example.com',
      subject: 'subject',
      text: 'hello'
    });

    assert.deepEqual(res, { id: 'queued' });
    assert.equal(captured.opts.host, 'api.mailgun.net');
    assert.equal(captured.opts.method, 'POST');
    assert.match(captured.opts.path, /sandbox\.example\.org\/messages/);
    assert.match(captured.body, /from=from%40example\.com/);
  } finally {
    helpers.request = originalRequest;
    process.env.MAILGUN_API_HOST = originalHost;
    process.env.MAILGUN_API_DOMAIN = originalDomain;
    process.env.MAILGUN_API_KEY = originalKey;
  }
});

test('charge helper methods produce expected request shapes', async () => {
  const originalHost = process.env.STRIPE_API_HOST;
  const originalToken = process.env.STRIPE_API_TOKEN;
  const originalHelpersRequest = helpers.request;

  try {
    process.env.STRIPE_API_HOST = 'api.stripe.com';
    process.env.STRIPE_API_TOKEN = 'sk_test_x';

    const reqObj = charge.prepRequestObj({ path: '/v1/charges', method: 'POST' });
    assert.equal(reqObj.host, 'api.stripe.com');
    assert.equal(reqObj.path, '/v1/charges');
    assert.equal(reqObj.method, 'POST');
    assert.match(reqObj.headers.Authorization, /sk_test_x/);

    const body = charge.prepChargeReqStr({
      cartTotal: 2100,
      source: { customer: 'cus_123' }
    });
    assert.match(body, /amount=2100/);
    assert.match(body, /customer=cus_123/);
    assert.match(body, /currency=usd/);

    helpers.request = async () => ({ id: 'ok' });
    const stripeOk = await charge.makeStripeReq({ path: '/v1/customers', method: 'GET' }, 'x=1');
    assert.deepEqual(stripeOk, { id: 'ok' });

    helpers.request = async () => {
      throw new Error('down');
    };
    await assert.rejects(() => charge.makeStripeReq({ path: '/v1/customers', method: 'GET' }, 'x=1'));
  } finally {
    process.env.STRIPE_API_HOST = originalHost;
    process.env.STRIPE_API_TOKEN = originalToken;
    helpers.request = originalHelpersRequest;
  }
});

test('charge.proceedWithStripeUser triggers downstream charge flow for both source branches', async () => {
  const originalMakeStripeReq = charge.makeStripeReq;
  const originalChargeStripeCustomer = charge.chargeStripeCustomer;

  try {
    let callCount = 0;
    charge.chargeStripeCustomer = () => {
      callCount += 1;
    };

    charge.proceedWithStripeUser(
      { id: 'cus_1', sources: { data: [{ customer: 'cus_1' }] } },
      { id: null, source: null, cartTotal: 1000 },
      { path: '/v1/customers', method: 'GET' },
      {}
    );
    assert.equal(callCount, 1);

    charge.makeStripeReq = async () => ({ customer: 'cus_2' });
    charge.proceedWithStripeUser(
      { id: 'cus_2', sources: { data: [] } },
      { id: null, source: null, cartTotal: 1000 },
      { path: '/v1/customers', method: 'GET' },
      {}
    );

    await waitForTick();
    assert.equal(callCount, 2);
  } finally {
    charge.makeStripeReq = originalMakeStripeReq;
    charge.chargeStripeCustomer = originalChargeStripeCustomer;
  }
});

test('charge.chargeStripeCustomer success and failure branches', async () => {
  const originalMakeStripeReq = charge.makeStripeReq;
  const originalMailSend = doMail.send;
  const originalLogsAppend = logsLib.append;

  try {
    charge.makeStripeReq = async () => ({ id: 'ch_1' });
    doMail.send = async () => ({ id: 'mail_1' });
    logsLib.append = (_dir, _name, _str, cb) => cb(false);

    const success = await new Promise((resolve) => {
      charge.chargeStripeCustomer(
        { path: '/x', method: 'POST' },
        { cartTotal: 1000, source: { customer: 'cus_1' } },
        {
          logFileName: 'order-1',
          logString: '{"ok":true}',
          callback: (statusCode, payload) => resolve({ statusCode, payload })
        }
      );
    });
    assert.equal(success.statusCode, 200);

    doMail.send = async () => {
      throw new Error('mail failed');
    };
    const mailErr = await new Promise((resolve) => {
      charge.chargeStripeCustomer(
        { path: '/x', method: 'POST' },
        { cartTotal: 1000, source: { customer: 'cus_1' } },
        {
          logFileName: 'order-2',
          logString: '{"ok":true}',
          callback: (statusCode, payload) => resolve({ statusCode, payload })
        }
      );
    });
    assert.equal(mailErr.statusCode, 400);
    assert.ok(mailErr.payload.MailErr);

    charge.makeStripeReq = async () => {
      throw new Error('stripe failed');
    };
    const chargeErr = await new Promise((resolve) => {
      charge.chargeStripeCustomer(
        { path: '/x', method: 'POST' },
        { cartTotal: 1000, source: { customer: 'cus_1' } },
        {
          logFileName: 'order-3',
          logString: '{"ok":true}',
          callback: (statusCode, payload) => resolve({ statusCode, payload })
        }
      );
    });
    assert.equal(chargeErr.statusCode, 400);
    assert.equal(chargeErr.payload.Error, 'Error charging');
  } finally {
    charge.makeStripeReq = originalMakeStripeReq;
    doMail.send = originalMailSend;
    logsLib.append = originalLogsAppend;
  }
});

test('charge.post validates missing token, invalid token, and missing cart branches', async () => {
  const missingToken = await new Promise((resolve) => {
    charge.post({ headers: {}, payload: { email: 'a@b.com' } }, (statusCode, payload) => {
      resolve({ statusCode, payload });
    });
  });
  assert.equal(missingToken.statusCode, 400);

  const originalVerify = doTokens.verifyTokenMatch;
  const originalRead = dataLib.read;
  const originalProceed = charge.proceedWithStripeUser;
  const originalMakeStripeReq = charge.makeStripeReq;
  const originalUserPatch = doUsers.patch;

  try {
    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(false);
    const invalidToken = await new Promise((resolve) => {
      charge.post({ headers: { token: 'bad' }, payload: { email: 'a@b.com' } }, (statusCode, payload) => {
        resolve({ statusCode, payload });
      });
    });
    assert.equal(invalidToken.statusCode, 400);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(true);
    dataLib.read = (_dir, _file, cb) => cb(false, undefined);
    const noCart = await new Promise((resolve) => {
      charge.post({ headers: { token: 'ok' }, payload: { email: 'a@b.com' } }, (statusCode, payload) => {
        resolve({ statusCode, payload });
      });
    });
    assert.equal(noCart.statusCode, 400);

    let proceedCalled = false;
    dataLib.read = (_dir, _file, cb) => cb(false, { cartData: [{ price: 10, count: 1 }] });
    charge.proceedWithStripeUser = () => {
      proceedCalled = true;
    };

    charge.post(
      { headers: { token: 'ok' }, payload: { email: 'a@b.com', stripeID: 'cus_123' } },
      () => {}
    );
    await waitForTick();
    assert.equal(proceedCalled, true);

    proceedCalled = false;
    charge.makeStripeReq = async () => ({ id: 'cus_new' });
    doUsers.patch = (_payload, cb) => cb(200);
    charge.post({ headers: { token: 'ok' }, payload: { email: 'a@b.com' } }, () => {});
    await waitForTick();
    assert.equal(proceedCalled, true);
  } finally {
    doTokens.verifyTokenMatch = originalVerify;
    dataLib.read = originalRead;
    charge.proceedWithStripeUser = originalProceed;
    charge.makeStripeReq = originalMakeStripeReq;
    doUsers.patch = originalUserPatch;
  }
});
