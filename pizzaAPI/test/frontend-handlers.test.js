const test = require('node:test');
const assert = require('node:assert/strict');

const helpers = require('../lib/helpers');
const frontendHandlers = require('../lib/handlers/frontend');

function makeData(method) {
  return { method };
}

test('frontend handlers call helpers.getFrontend with expected templates on GET', async () => {
  const originalGetFrontend = helpers.getFrontend;
  const calls = [];

  try {
    helpers.getFrontend = (view, data, cb) => {
      calls.push({ view, data });
      cb(200, `<html>${view}</html>`, 'html');
    };

    const handlers = [
      frontendHandlers.indexHandler,
      frontendHandlers.accountCreateHandler,
      frontendHandlers.accountEditHandler,
      frontendHandlers.sessionCreateHandler,
      frontendHandlers.sessionDeletedHandler,
      frontendHandlers.checkoutHandler,
      frontendHandlers.cartViewHandler,
      frontendHandlers.menuHandler
    ];

    for (const handler of handlers) {
      await new Promise((resolve) => {
        handler(makeData('get'), () => resolve());
      });
    }

    assert.deepEqual(
      calls.map((c) => c.view),
      ['index', 'accountCreate', 'accountEdit', 'sessionCreate', 'sessionDeleted', 'checkout', 'cart', 'menu']
    );
  } finally {
    helpers.getFrontend = originalGetFrontend;
  }
});

test('frontend handlers return 405 when method is not allowed', async () => {
  await new Promise((resolve) => {
    frontendHandlers.indexHandler(makeData('post'), (statusCode, _payload, contentType) => {
      assert.equal(statusCode, 405);
      assert.equal(contentType, 'html');
      resolve();
    });
  });

  await new Promise((resolve) => {
    frontendHandlers.accountEditHandler(makeData('post'), (statusCode, _payload, contentType) => {
      assert.equal(statusCode, 405);
      assert.equal(contentType, 'html');
      resolve();
    });
  });

  await new Promise((resolve) => {
    frontendHandlers.sessionCreateHandler(makeData('post'), (statusCode, _payload, contentType) => {
      assert.equal(statusCode, 405);
      assert.equal(contentType, 'html');
      resolve();
    });
  });

  await new Promise((resolve) => {
    frontendHandlers.sessionDeletedHandler(makeData('post'), (statusCode, _payload, contentType) => {
      assert.equal(statusCode, 405);
      assert.equal(contentType, 'html');
      resolve();
    });
  });
});
